import styles from "./interview-schedule.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
    AutoComplete,
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Tooltip,
} from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep, isEmpty } from "lodash/lang";
import { findInterview, findTemplate } from "../../utils/converters";
import { POSITIONS, POSITIONS_OPTIONS, Status } from "../../utils/constants";
import Layout from "../../components/layout/layout";
import { InterviewPreviewCard } from "../interview-scorecard/step-assessment/type-interview/interview-sections";
import { addInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { loadTemplates } from "../../store/templates/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { personalEvent } from "../../analytics";
import { routeInterviews, routeTemplateLibrary } from "../../utils/route";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
    datePickerFormat,
    formatDate,
    formatDateISO,
    generateTimeSlots,
    parseDateISO,
    timePickerFormat,
} from "../../utils/date-fns";
import { filterOptionLabel, interviewsPositions } from "../../utils/filters";
import Spinner from "../../components/spinner/spinner";
import { useAuth0 } from "../../react-auth0-spa";
import CreateCandidate from "../candidate-details/create-candidate";
import Card from "../../components/card/card";
import { log } from "../../utils/log";
import { uniq } from "lodash/array";
import DatePicker from "../../components/antd/DatePicker";
import { addHours, parse, roundToNearestMinutes, set } from "date-fns";
import { InterviewType } from "../../store/models";
import { INTERVIEW_TAKE_HOME, interviewWithoutDate } from "../../utils/interview";
import InterviewTypeTag from "../../components/tags/interview-type-tag";

const { Option } = Select;

/**
 *
 * @param {UserProfile} profile
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {TeamMember[]} teamMembers
 * @param {Candidate[]} candidates
 * @param addInterview
 * @param loadInterviews
 * @param updateInterview
 * @param loadTemplates
 * @param loadCandidates
 * @param loadTeamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewSchedule = ({
    profile,
    interviews,
    templates,
    candidates,
    teamMembers,
    addInterview,
    loadInterviews,
    updateInterview,
    loadTemplates,
    loadCandidates,
    loadTeamMembers,
}) => {
    const history = useHistory();

    const { id } = useParams();
    const { user } = useAuth0();
    const location = useLocation();

    const defaultStructure = {
        header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
        footer: "Allow 10 minutes at the end for the candidate to ask questions.",
        groups: [],
    };

    const defaultStartDateTime = formatDateISO(roundToNearestMinutes(new Date(), { nearestTo: 15 }));
    const defaultEndDateTime = formatDateISO(roundToNearestMinutes(addHours(new Date(), 1), { nearestTo: 15 }));

    /**
     *
     * @type {Interview}
     */
    const emptyInterview = {
        interviewId: undefined,
        templateIds: [],
        status: Status.NEW,
        title: "",
        structure: defaultStructure,
        interviewDateTime: defaultStartDateTime,
        interviewEndDateTime: defaultEndDateTime,
    };

    const [interview, setInterview] = useState(emptyInterview);
    const [positionOptions, setPositionOptions] = useState(POSITIONS_OPTIONS);
    const [candidatesOptions, setCandidateOptions] = useState([]);
    const [interviewersOptions, setInterviewersOptions] = useState([]);
    const [createCandidate, setCreateCandidate] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);

    const selectedCandidate = candidates.find(c => c.candidateId === interview.candidateId);
    const isTakeHomeChallenge = interview.interviewType === InterviewType.TAKE_HOME_TASK;

    React.useEffect(() => {
        // existing interview
        if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            const existingInterview = cloneDeep(findInterview(id, interviews));
            // backwards compatibility for interviews without dates
            if (!parseDateISO(existingInterview.interviewDateTime)) {
                existingInterview.interviewDateTime = defaultStartDateTime;
                existingInterview.interviewEndDateTime = defaultEndDateTime;
            } else if (!parseDateISO(existingInterview.interviewEndDateTime)) {
                // backwards compatibility for interviews without end date
                existingInterview.interviewEndDateTime = existingInterview.interviewDateTime;
            }
            setInterview(existingInterview);
        } else if (isFromTemplateFlow() && interview.templateIds.length === 0 && templates.length !== 0) {
            // new interview from template
            onTemplateSelect(fromTemplateId());
        } else {
            // pre-select current user as interviewer
            setInterview({
                ...interview,
                interviewers: [profile.userId],
            });
        }

        // eslint-disable-next-line
    }, [interviews, templates, teamMembers]);

    React.useEffect(() => {
        if (!isEmpty(interviews)) {
            setPositionOptions(
                uniq(interviewsPositions(interviews).concat(POSITIONS)).map(position => ({
                    value: position,
                }))
            );
        }
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        // templates selector
        if (candidates.length !== 0) {
            setCandidateOptions(
                candidates.map(candidate => ({
                    value: candidate.candidateId,
                    label: candidate.candidateName,
                }))
            );
        }
        // eslint-disable-next-line
    }, [candidates]);

    React.useEffect(() => {
        if (teamMembers.length !== 0) {
            // interviewers selector
            const currentUser = teamMembers.find(member => member.email === user.email);
            setInterviewersOptions(
                teamMembers.map(member =>
                    member.userId === currentUser.userId
                        ? {
                              label: `${member.name} (you)`,
                              value: member.userId,
                          }
                        : {
                              label: member.name,
                              value: member.userId,
                          }
                )
            );
        }
        // eslint-disable-next-line
    }, [teamMembers]);

    React.useEffect(() => {
        loadTemplates();
        loadCandidates();
        loadTeamMembers(profile.currentTeamId);
        loadInterviews();

        // eslint-disable-next-line
    }, []);

    const isExistingInterviewFlow = () => id;

    const isFromTemplateFlow = () => fromTemplateId() !== null;

    const isInitialLoading = () =>
        (isExistingInterviewFlow() && !interview.interviewId) ||
        (isFromTemplateFlow() && interview.templateIds.length === 0);

    /**
     *
     * @returns {string|null}
     */
    const fromTemplateId = () => {
        const params = new URLSearchParams(location.search);
        return params.get("fromTemplate");
    };

    const onBackClicked = () => {
        history.goBack();
    };

    const onPositionChange = value => {
        interview.position = value;
    };

    const onInterviewersChange = values => {
        interview.interviewers = values;
    };

    const onDateChange = newDate => {
        interview.interviewDateTime = formatDateISO(
            set(parseDateISO(interview.interviewDateTime), {
                year: newDate.getFullYear(),
                month: newDate.getMonth(),
                date: newDate.getDate(),
            })
        );
        interview.interviewEndDateTime = formatDateISO(
            set(parseDateISO(interview.interviewEndDateTime), {
                year: newDate.getFullYear(),
                month: newDate.getMonth(),
                date: newDate.getDate(),
            })
        );

        logInterviewDateTime();
    };

    const onStartTimeChange = value => {
        let interviewDateTime = parseDateISO(interview.interviewDateTime);
        interview.interviewDateTime = formatDateISO(parse(value, "HH:mm", interviewDateTime));

        interviewDateTime = parseDateISO(interview.interviewDateTime);
        if (interviewDateTime > parseDateISO(interview.interviewEndDateTime)) {
            interview.interviewEndDateTime = formatDateISO(addHours(interviewDateTime, 1));
            form.setFieldsValue({
                endTime: formatDate(interview.interviewEndDateTime, timePickerFormat()),
            });
        }

        logInterviewDateTime();
    };

    const onEndTimeChange = value => {
        let interviewDateTime = parseDateISO(interview.interviewDateTime);
        interview.interviewEndDateTime = formatDateISO(parse(value, "HH:mm", interviewDateTime));

        interviewDateTime = parseDateISO(interview.interviewDateTime);
        let interviewEndDateTime = parseDateISO(interview.interviewEndDateTime);
        if (interviewDateTime > interviewEndDateTime) {
            interview.interviewDateTime = formatDateISO(addHours(interviewEndDateTime, -1));
            form.setFieldsValue({
                startTime: formatDate(interview.interviewDateTime, timePickerFormat()),
            });
        }

        logInterviewDateTime();
    };

    const logInterviewDateTime = () => {
        log("Interview start date ", interview.interviewDateTime);
        log("Interview end date ", interview.interviewEndDateTime);
    };

    const onSaveClicked = () => {
        if (isExistingInterviewFlow()) {
            updateInterview(interview);
            message.success(`Interview '${interview.candidate}' updated.`);
        } else {
            addInterview(interview);
            personalEvent("Interview created");
            message.success(`Interview '${interview.candidate}' created.`);
        }
        history.push(routeInterviews());
    };

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    // const onPreviewClicked = () => {
    //     setPreviewModalVisible(true);
    // };

    const onTemplateSelect = templateId => {
        const template = cloneDeep(findTemplate(templateId, templates));
        setInterview({
            ...interview,
            templateIds: [templateId],
            interviewType: template.interviewType,
            liveCodingChallenges:
                template.interviewType === InterviewType.LIVE_CODING ? template.challenges : undefined,
            takeHomeChallenge:
                template.interviewType === InterviewType.TAKE_HOME_TASK ? template.challenges[0] : undefined,
            structure: template.structure,
            checklist: template.checklist,
        });
    };

    const onCandidateChange = (candidateId, candidate) => {
        const selectedCandidate = candidates.find(c => c.candidateId === candidateId);
        setInterview({
            ...interview,
            candidateId: candidateId,
            candidate: candidate,
            sendChallenge: !isEmpty(selectedCandidate?.email),
        });
    };

    const onCreateTemplateClicked = () => {
        history.push(routeTemplateLibrary());
    };

    const onSendChallengeChanged = checked => {
        setInterview({
            ...interview,
            sendChallenge: checked,
        });
    };

    const marginTop12 = { marginTop: 12 };
    const [form] = Form.useForm();

    const SendAssignmentFormItem = () => {
        const checkbox = (
            <Checkbox
                checked={interview.sendChallenge}
                disabled={isEmpty(selectedCandidate?.email)}
                onChange={e => onSendChallengeChanged(e.target.checked)}
            >
                Send assignment via email now
            </Checkbox>
        );

        const formContent = isEmpty(selectedCandidate?.email) ? (
            <Tooltip title='Candidate email is not available'>
                {/*span is required to show Tooltip for disabled button*/}
                <span>{checkbox}</span>
            </Tooltip>
        ) : (
            checkbox
        );

        return (
            <Form.Item className={styles.formItem} label={<Text strong>{INTERVIEW_TAKE_HOME}</Text>}>
                {formContent}
            </Form.Item>
        );
    };

    const InterviewDetails = () => (
        <Card style={marginTop12} key={interview.interviewId}>
            <div className={styles.header} style={{ marginBottom: 12 }}>
                <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                    <ArrowLeftOutlined />
                    <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                        Schedule Interview
                    </Title>
                </div>
            </div>
            <Text type='secondary'>
                Enter interview details information so you can easily discover it among other interviews.
            </Text>
            <Form
                name='basic'
                style={marginTop12}
                form={form}
                layout='vertical'
                initialValues={{
                    template: interview.templateIds,
                    candidateId: interview.candidateId,
                    candidate: interview.candidate,
                    date: parseDateISO(interview.interviewDateTime),
                    startTime: formatDate(interview.interviewDateTime, timePickerFormat()),
                    endTime: formatDate(interview.interviewEndDateTime, timePickerFormat()),
                    position: interview.position ? interview.position : undefined,
                    interviewers: interview.interviewers || [],
                }}
                onFinish={onSaveClicked}
            >
                {isExistingInterviewFlow() && !interview.candidateId ? (
                    <Form.Item
                        name='candidate'
                        className={styles.formItem}
                        label={<Text strong>Candidate</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter candidate name",
                            },
                        ]}
                    >
                        <Input
                            className='fs-mask'
                            placeholder='Enter candidate full name'
                            onChange={e => (interview.candidate = e.target.value)}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name='candidateId'
                        className={styles.formItem}
                        label={<Text strong>Candidate</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter candidate name",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            allowClear
                            placeholder='Select candidate'
                            onChange={(value, option) => onCandidateChange(value, option.label)}
                            options={candidatesOptions}
                            filterOption={filterOptionLabel}
                            notFoundContent={<Text>No candidate found.</Text>}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: "4px 0" }} />
                                    <Button
                                        style={{ paddingLeft: 12 }}
                                        onClick={() => setCreateCandidate(true)}
                                        type='link'
                                    >
                                        Create new candidate
                                    </Button>
                                </div>
                            )}
                        />
                    </Form.Item>
                )}
                <Form.Item
                    name='interviewers'
                    className={styles.formItem}
                    label={<Text strong>Interviewers</Text>}
                    rules={[
                        {
                            required: true,
                            message: "Please select at least 1 interviewer",
                        },
                    ]}
                >
                    <Select
                        mode='multiple'
                        placeholder='Select interviewers'
                        disabled={isExistingInterviewFlow()}
                        options={interviewersOptions}
                        filterOption={filterOptionLabel}
                        onChange={onInterviewersChange}
                    />
                </Form.Item>
                <Form.Item
                    name='template'
                    className={styles.formItem}
                    label={<Text strong>Template</Text>}
                    rules={[
                        {
                            required: true,
                            message: "Please select template",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        allowClear={false}
                        placeholder='Select interview template'
                        onSelect={onTemplateSelect}
                        filterOption={filterOptionLabel}
                        notFoundContent={<Text>No template found.</Text>}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                <Divider style={{ margin: "4px 0" }} />
                                <Button style={{ paddingLeft: 12 }} onClick={onCreateTemplateClicked} type='link'>
                                    Create new template
                                </Button>
                            </div>
                        )}
                    >
                        {templates &&
                            templates.map(template => (
                                <Option value={template.templateId} label={template.title}>
                                    <div className='demo-option-label-item'>
                                        {template.title}
                                        <InterviewTypeTag interviewType={template.interviewType} />
                                    </div>
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                {isTakeHomeChallenge && SendAssignmentFormItem()}
                {!interviewWithoutDate(interview) && (
                    <div className={styles.formDate}>
                        <Form.Item
                            name='date'
                            label={<Text strong>Interview Date</Text>}
                            className={styles.fillWidth}
                            style={{ marginRight: 16 }}
                        >
                            <DatePicker
                                allowClear={false}
                                format={datePickerFormat()}
                                className={styles.fillWidth}
                                onChange={onDateChange}
                            />
                        </Form.Item>
                        <Form.Item name='startTime' style={{ marginRight: 16 }}>
                            <Select
                                allowClear={false}
                                showSearch
                                placeholder='Start time'
                                options={generateTimeSlots()}
                                onSelect={onStartTimeChange}
                                className={styles.fillWidth}
                            />
                        </Form.Item>
                        <Form.Item name='endTime'>
                            <Select
                                allowClear={false}
                                showSearch
                                placeholder='End time'
                                options={generateTimeSlots()}
                                onSelect={onEndTimeChange}
                                className={styles.fillWidth}
                            />
                        </Form.Item>
                    </div>
                )}
                <Form.Item name='position' className={styles.formItem} label={<Text strong>Position</Text>}>
                    <AutoComplete
                        allowClear
                        placeholder='Select position you are hiring for'
                        options={positionOptions}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onChange={onPositionChange}
                    />
                </Form.Item>
                <Divider />
                <div className={styles.divSpaceBetween}>
                    <div>
                        {isTakeHomeChallenge && interview.sendChallenge && (
                            <span>
                            <Text>Take-home assignment will be sent to </Text>
                            <Text strong>{selectedCandidate.email}</Text>
                        </span>
                        )}
                    </div>
                    <Space>
                        {/*<Button onClick={onPreviewClicked}>Preview</Button>*/}
                        <Button type='primary' htmlType='submit'>
                            Save
                        </Button>
                    </Space>
                </div>
            </Form>
        </Card>
    );

    return (
        <Layout contentStyle={styles.rootContainer}>
            {isInitialLoading() ? (
                <Spinner />
            ) : (
                <Row>
                    <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                        {!createCandidate && <InterviewDetails />}

                        {createCandidate && (
                            <CreateCandidate
                                onSave={candidateName => {
                                    var selectedCandidates = candidates.filter(c => c.candidateName === candidateName);

                                    if (selectedCandidates.length > 0) {
                                        interview.candidateId = selectedCandidates[0].candidateId;
                                        interview.candidate = selectedCandidates[0].candidateName;

                                        form.setFieldsValue({
                                            candidateId: selectedCandidates[0].candidateId,
                                        });
                                    }
                                    setCreateCandidate(false);
                                }}
                                onCancel={() => setCreateCandidate(false)}
                            />
                        )}
                    </Col>
                </Row>
            )}

            <Modal
                title={null}
                footer={null}
                closable={false}
                destroyOnClose={true}
                width={1000}
                style={{ top: "5%" }}
                bodyStyle={{ backgroundColor: "#EEF0F2F5" }}
                onCancel={onPreviewClosed}
                visible={previewModalVisible}
            >
                <InterviewPreviewCard interview={interview} onCloseClicked={onPreviewClosed} />
            </Modal>
        </Layout>
    );
};

const mapDispatch = {
    addInterview,
    loadInterviews,
    updateInterview,
    loadTemplates,
    loadCandidates,
    loadTeamMembers,
};

const mapState = state => {
    const interviewState = state.interviews || {};
    const templateState = state.templates || {};
    const candidatesState = state.candidates || {};
    const userState = state.user || {};

    return {
        profile: userState.profile,
        interviews: interviewState.interviews,
        templates: templateState.templates,
        candidates: candidatesState.candidates.filter(c => !c.archived),
        teamMembers: userState.teamMembers || [],
    };
};

export default connect(mapState, mapDispatch)(InterviewSchedule);

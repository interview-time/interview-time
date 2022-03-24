import styles from "./interview-schedule.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
    AutoComplete,
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    TimePicker,
} from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findTemplate } from "../../components/utils/converters";
import { DATE_FORMAT_SERVER, POSITIONS, Status } from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import { InterviewPreviewCard } from "../interview-scorecard/interview-sections";
import { addInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { loadTemplates } from "../../store/templates/actions";
import { loadTeamMembers } from "../../store/user/actions";
import { personalEvent } from "../../analytics";
import { routeInterviews, routeTemplateLibrary } from "../../components/utils/route";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { sortBy } from "lodash/collection";
import { datePickerFormat, getDate, timePickerFormat } from "../../components/utils/date";
import { filterOptionLabel } from "../../components/utils/filters";
import Spinner from "../../components/spinner/spinner";
import { useAuth0 } from "../../react-auth0-spa";
import CreateCandidate from "../candidate-details/create-candidate";
import Card from "../../components/card/card";
import { log } from "../../components/utils/log";
import moment from "moment";

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
    };

    const [interview, setInterview] = useState(emptyInterview);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [candidatesOptions, setCandidateOptions] = useState([]);
    const [interviewersOptions, setInterviewersOptions] = useState([]);
    const [createCandidate, setCreateCandidate] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);

    const durationOptions = [
        {
            value: 30,
            label: "30 min",
        },
        {
            value: 60,
            label: "1 hour",
        },
        {
            value: 90,
            label: "1 hour 30 minutes",
        },
        {
            value: 120,
            label: "2 hours",
        },
        {
            value: 150,
            label: "2 hours 30 minutes",
        },
        {
            value: 180,
            label: "3 hours",
        },
        {
            value: 210,
            label: "3 hours 30 minutes",
        },
        {
            value: 240,
            label: "4 hours",
        },
    ];

    React.useEffect(() => {
        // existing interview
        if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)));
        } else if (isFromTemplateFlow() && interview.templateIds.length === 0 && templates.length !== 0) {
            // new interview from template
            const template = cloneDeep(findTemplate(fromTemplateId(), templates));
            setInterview({
                ...interview,
                templateIds: [template.templateId],
                structure: template.structure,
                interviewers: [profile.userId],
            });
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
        // templates selector
        if (templates.length !== 0) {
            setTemplateOptions(
                templates.map(template => ({
                    value: template.templateId,
                    label: template.title,
                }))
            );
        }
        // eslint-disable-next-line
    }, [templates]);

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

        if (isExistingInterviewFlow()) {
            loadInterviews();
        }

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
        let date = getDate(interview.interviewDateTime);
        if (date) {
            interview.interviewDateTime = date
                .clone()
                .year(newDate.year())
                .month(newDate.month())
                .date(newDate.date())
                .utc()
                .format(DATE_FORMAT_SERVER);
            interview.interviewEndDateTime = date
                .clone()
                .year(newDate.year())
                .month(newDate.month())
                .date(newDate.date())
                .utc()
                .format(DATE_FORMAT_SERVER);
        } else {
            // current time + selected date
            interview.interviewDateTime = newDate.clone().utc().format(DATE_FORMAT_SERVER);
            interview.interviewEndDateTime = newDate.clone().add(1, "hour").utc().format(DATE_FORMAT_SERVER);
        }

        logInterviewDateTime();
    };

    const onTimeChange = time => {
        let date = getDate(interview.interviewDateTime);
        let duration = getDurationMinutes(interview.interviewDateTime, interview.interviewEndDateTime);
        console.log(duration)
        if (date && duration) {
            interview.interviewDateTime = date
                .clone()
                .hour(time.hour())
                .minute(time.minute())
                .utc()
                .format(DATE_FORMAT_SERVER);

            interview.interviewEndDateTime = date
                .clone()
                .hour(time.hour())
                .minute(time.minute())
                .add(duration, "minutes")
                .utc()
                .format(DATE_FORMAT_SERVER);
        } else {
            // current date + selected time
            interview.interviewDateTime = time.clone().utc().format(DATE_FORMAT_SERVER);
            interview.interviewEndDateTime = time.clone().add(1, "hour").utc().format(DATE_FORMAT_SERVER);
        }

        logInterviewDateTime();
    };

    const onDurationChange = duration => {
        let date = getDate(interview.interviewDateTime);
        if (date) {
            interview.interviewEndDateTime = date.clone().add(duration, "minutes").utc().format(DATE_FORMAT_SERVER);
        } else {
            // current date + selected time
            interview.interviewDateTime = moment().utc().format(DATE_FORMAT_SERVER);
            interview.interviewEndDateTime = moment().add(duration, "minutes").utc().format(DATE_FORMAT_SERVER);
        }

        logInterviewDateTime();
    };

    const getDurationMinutes = (start, end) => (start && end ? (getDate(end) - getDate(start)) / 1000 / 60 : undefined);

    const logInterviewDateTime = () => {
        log("Interview start date (utc)", interview.interviewDateTime);
        log("Interview end date (utc)", interview.interviewEndDateTime);

        log("Interview start date (local)", getDate(interview.interviewDateTime).format(DATE_FORMAT_SERVER));
        log("Interview end date (local)", getDate(interview.interviewEndDateTime).format(DATE_FORMAT_SERVER));
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

    const onPreviewClicked = () => {
        setPreviewModalVisible(true);
    };

    const onTemplateSelect = templateIds => {
        if (templateIds.length !== 0) {
            let interviewStructure = null;
            templateIds.forEach((templateId, index) => {
                let template = templates.find(template => template.templateId === templateIds[index]);
                let structure = cloneDeep(template.structure);
                if (index === 0) {
                    // use first template to define main structure
                    interviewStructure = structure;
                } else {
                    structure.groups.forEach(group => {
                        group.name = `${template.title} - ${group.name}`;
                    });

                    interviewStructure.groups.push(...structure.groups);
                }
            });

            setInterview({
                ...interview,
                templateIds: templateIds,
                structure: interviewStructure,
            });
        } else {
            setInterview({
                ...interview,
                templateIds: [],
                structure: defaultStructure,
            });
        }
    };

    const onCreateTemplateClicked = () => {
        history.push(routeTemplateLibrary());
    };

    const marginTop12 = { marginTop: 12 };
    const [form] = Form.useForm();

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
                    date: getDate(interview.interviewDateTime),
                    time: getDate(interview.interviewDateTime),
                    duration: getDurationMinutes(interview.interviewDateTime, interview.interviewEndDateTime),
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
                            onChange={(value, option) => {
                                interview.candidateId = value;
                                interview.candidate = option.label;
                            }}
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
                <Form.Item name='template' className={styles.formItem} label={<Text strong>Template</Text>}>
                    <Select
                        showSearch
                        allowClear
                        mode='multiple'
                        placeholder='Select interview template'
                        onChange={onTemplateSelect}
                        options={templateOptions}
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
                    />
                </Form.Item>
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
                    <Form.Item name='time' className={styles.fillWidth} style={{ marginRight: 16 }}>
                        <TimePicker
                            allowClear={false}
                            minuteStep={15}
                            format={timePickerFormat()}
                            className={styles.fillWidth}
                            onChange={onTimeChange}
                        />
                    </Form.Item>
                    <Form.Item name='duration' className={styles.fillWidth}>
                        <Select
                            allowClear={false}
                            placeholder='Select duration'
                            options={durationOptions}
                            className={styles.fillWidth}
                            onSelect={onDurationChange}
                        />
                    </Form.Item>
                </div>
                <Form.Item name='position' className={styles.formItem} label={<Text strong>Position</Text>}>
                    <AutoComplete
                        allowClear
                        placeholder='Select position you are hiring for'
                        options={sortBy(POSITIONS, ["value"])}
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onChange={onPositionChange}
                    />
                </Form.Item>
                <Divider />
                <div className={styles.divSpaceBetween}>
                    <Text />
                    <Space>
                        <Button onClick={onPreviewClicked}>Preview</Button>
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
                                teamId={profile.currentTeamId}
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

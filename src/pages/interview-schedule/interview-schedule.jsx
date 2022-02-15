import styles from "./interview-schedule.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AutoComplete, Button, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findTemplate } from "../../components/utils/converters";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER, POSITIONS, Status } from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import { InterviewPreviewCard } from "../interview-scorecard/interview-sections";
import {
    addInterview,
    addInterviewWithTemplate,
    loadInterviews,
    updateInterview,
} from "../../store/interviews/actions";
import { loadCandidates } from "../../store/candidates/actions";
import { loadTemplates } from "../../store/templates/actions";
import { personalEvent } from "../../analytics";
import { routeInterviews, routeTemplateLibrary } from "../../components/utils/route";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { sortBy } from "lodash/collection";
import { getDate } from "../../components/utils/utils";
import { filterOptionLabel } from "../../components/utils/filters";
import Spinner from "../../components/spinner/spinner";
import { loadTeamMembers } from "../../store/user/actions";
import { useAuth0 } from "../../react-auth0-spa";
import CreateCandidate from "./create-candidate";
import Card from "../../components/card/card";

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {TeamMember[]} teamMembers
 * @param {Candidate[]} candidates
 * @param activeTeam
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
    interviews,
    templates,
    candidates,
    teamMembers,
    activeTeam,
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
        templateId: undefined,
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

    React.useEffect(() => {
        // existing interview
        if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)));
        }

        // new interview from template
        if (isFromTemplateFlow() && !interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(fromTemplateId(), templates));
            setInterview({
                ...interview,
                templateId: template.templateId,
                structure: template.structure,
            });
        }

        // eslint-disable-next-line
    }, [interview, templates]);

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

            if (!isExistingInterviewFlow()) {
                // pre-select current user as interviewer
                setInterview({
                    ...interview,
                    interviewers: [currentUser.userId],
                });
            }
        }
        // eslint-disable-next-line
    }, [teamMembers]);

    React.useEffect(() => {
        loadTemplates();
        loadCandidates();
        loadTeamMembers(activeTeam.teamId);

        if (isExistingInterviewFlow()) {
            loadInterviews();
        }

        // eslint-disable-next-line
    }, []);

    const isExistingInterviewFlow = () => id;

    const isFromTemplateFlow = () => fromTemplateId() !== null;

    const isInitialLoading = () =>
        (isExistingInterviewFlow() && !interview.interviewId) || (isFromTemplateFlow() && !interview.templateId);

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

    const onDateChange = date => {
        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER);
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
            // use first template to define main structure
            let mainTemplate = cloneDeep(templates.find(template => template.templateId === templateIds[0]));

            if (templateIds.length > 1) {
                let templatesStructure = mainTemplate.structure;
                templatesStructure.groups.forEach(group => {
                    group.name = `${mainTemplate.title} - ${group.name}`;
                });

                for (let i = 1; i < templateIds.length; i++) {
                    let template = templates.find(template => template.templateId === templateIds[i]);
                    let structure = cloneDeep(template.structure);
                    structure.groups.forEach(group => {
                        group.name = `${template.title} - ${group.name}`;
                    });

                    templatesStructure.groups.push(...structure.groups);
                }
                setInterview({
                    ...interview,
                    templateId: mainTemplate.templateId,
                    structure: templatesStructure,
                });
            } else {
                setInterview({
                    ...interview,
                    templateId: mainTemplate.templateId,
                    structure: mainTemplate.structure,
                });
            }
        } else {
            setInterview({
                ...interview,
                templateId: null,
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
                form={form}
                layout='vertical'
                initialValues={{
                    template: interview.templateId ? [interview.templateId] : undefined,
                    candidateId: interview.candidateId,
                    candidate: interview.candidate,
                    date: getDate(interview.interviewDateTime, undefined),
                    position: interview.position ? interview.position : undefined,
                    interviewers: interview.interviewers || [],
                }}
                onFinish={onSaveClicked}
            >
                <Col span={24} style={marginTop12}>
                    {isExistingInterviewFlow() && !interview.candidateId ? (
                        <Form.Item
                            name='candidate'
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
                </Col>
                <Col span={24}>
                    <Form.Item
                        name='interviewers'
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
                </Col>
                <Col span={24}>
                    <Form.Item name='template' label={<Text strong>Template</Text>}>
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
                </Col>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name='position' label={<Text strong>Position</Text>}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item name='date' label={<Text strong>Interview Date</Text>}>
                            <DatePicker
                                showTime={{
                                    minuteStep: 15,
                                }}
                                allowClear={false}
                                format={DATE_FORMAT_DISPLAY}
                                className={styles.fillWidth}
                                onChange={onDateChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>
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
    addInterviewWithTemplate,
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
        interviews: interviewState.interviews,
        templates: templateState.templates,
        candidates: candidatesState.candidates,
        teamMembers: userState.teamMembers || [],
        activeTeam: userState.activeTeam,
    };
};

export default connect(mapState, mapDispatch)(InterviewSchedule);

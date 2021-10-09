import styles from "./interview-schedule.module.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
    AutoComplete,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Popover,
    Row,
    Select,
    Space,
} from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview, findTemplate } from "../../components/utils/converters";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER, POSITIONS, Status, } from "../../components/utils/constants";
import Layout from "../../components/layout/layout";
import arrayMove from "array-move";
import { InterviewPreviewCard } from "../interview-scorecard/interview-sections";
import {
    addInterview,
    addInterviewWithTemplate,
    loadInterviews,
    updateInterview,
} from "../../store/interviews/actions";
import { loadTemplates } from "../../store/templates/actions";
import TemplateGroupModal from "../template-edit/template-group-modal";
import TemplateQuestionsCard from "../template-edit/template-questions-card";
import { personalEvent } from "../../analytics";
import { routeInterviews, routeTemplateNew } from "../../components/utils/route";
import { ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { sortBy } from "lodash/collection";
import { getDate} from "../../components/utils/utils";
import { filterOptionLabel} from "../../components/utils/filters";
import Spinner from "../../components/spinner/spinner";
import { loadTeamMembers } from "../../store/user/actions";
import { useAuth0 } from "../../react-auth0-spa";

const { TextArea } = Input;

/**
 *
 * @param {Interview[]} interviews
 * @param {Template[]} templates
 * @param {TeamMember[]} teamMembers
 * @param activeTeam
 * @param addInterview
 * @param addInterviewWithTemplate
 * @param loadInterviews
 * @param updateInterview
 * @param loadTemplates
 * @param loadTeamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewSchedule = ({
    interviews,
    templates,
    teamMembers,
    activeTeam,
    addInterview,
    addInterviewWithTemplate,
    loadInterviews,
    updateInterview,
    loadTemplates,
    loadTeamMembers,
}) => {

    const history = useHistory();

    const { id } = useParams();
    const { user } = useAuth0();
    const location = useLocation();

    /**
     *
     * @type {Interview}
     */
    const emptyInterview = {
        interviewId: undefined,
        templateId: undefined,
        libraryId: undefined,
        status: Status.NEW,
        interviewers: [user.email],
        title: "",
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [],
        },
    };

    const [interview, setInterview] = useState(emptyInterview);
    const [selectedTemplateCollapsed, setSelectedTemplateCollapsed] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateOptions, setTemplateOptions] = useState([]);
    const [interviewersOptions, setInterviewersOptions] = useState([]);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [questionGroupModal, setQuestionGroupModal] = useState({
        visible: false,
        name: null,
        id: null,
    });


    React.useEffect(() => {
        if (isFromTemplateFlow() && !interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(fromTemplateId(), templates));
            setInterview({
                ...interview,
                templateId: template.templateId,
                structure: template.structure,
            });
        } else if (isExistingInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)));
        }

        // selected template-edit
        if (interview.templateId && templates.length !== 0) {
            const template = cloneDeep(findTemplate(interview.templateId, templates));
            setSelectedTemplate(template);
        }

        // templates selector
        if (templates.length !== 0) {
            setTemplateOptions(
                templates.map((template) => ({
                    value: template.templateId,
                    label: template.title,
                }))
            );
        }

        // eslint-disable-next-line
    }, [interviews, id, templates, interview]);

    React.useEffect(() => {
        if(isTeamSpace() && teamMembers.length !== 0) {
            setInterviewersOptions(teamMembers.map(member =>
                member.email === user.email ? {
                    label: `${member.name} (you)`,
                    value: member.email,
                    disabled: !member.isAdmin // only admins can unselect themself
                } : {
                    label: member.name,
                    value: member.email,
                }))
        }
        // eslint-disable-next-line
    }, [teamMembers]);

    React.useEffect(() => {
        loadTemplates();

        if (isExistingInterviewFlow()) {
            loadInterviews();
        }

        if(isTeamSpace()) {
            loadTeamMembers(activeTeam.teamId);
        }

        // eslint-disable-next-line
    }, []);

    const isExistingInterviewFlow = () => id;

    const isFromTemplateFlow = () => fromTemplateId() !== null;

    const isTeamSpace = () => activeTeam && activeTeam.teamId;

    const isInitialLoading = () =>
        (isExistingInterviewFlow() && !interview.interviewId) ||
        (isFromTemplateFlow() && !interview.templateId);

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

    const onCandidateChange = (e) => {
        interview.candidate = e.target.value;
    };

    const onPositionChange = (value) => {
        interview.position = value;
    };

    const onInterviewersChange = (values) => {
        interview.interviewers = values
    }

    const onDateChange = (date) => {
        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER);
    };

    const onQuestionsSortChange = (groupId, questions) => {
        // no need to update state
        interview.structure.groups.find((group) => group.groupId === groupId).questions = questions;
    };

    const onAddQuestionClicked = (groupId) => {
        const questionId = Date.now().toString();
        const updatedInterview = cloneDeep(interview);
        updatedInterview.structure.groups
            .find((group) => group.groupId === groupId)
            .questions.push({
            questionId: questionId,
            question: "",
            tags: [],
        });
        setInterview(updatedInterview);
    };

    const onRemoveQuestionClicked = (questionId) => {
        const updatedInterview = cloneDeep(interview);
        updatedInterview.structure.groups.forEach(
            (group) => (group.questions = group.questions.filter((q) => q.questionId !== questionId))
        );
        setInterview(updatedInterview);
    };

    const onGroupTitleClicked = (id, name) => {
        setQuestionGroupModal({
            visible: true,
            name: name,
            id: id,
        });
    };

    const onAddQuestionGroupClicked = () => {
        setQuestionGroupModal({
            visible: true,
            name: null,
            id: null,
        });
    };

    const onDeleteGroupClicked = (id) => {
        const updatedInterview = cloneDeep(interview);
        updatedInterview.structure.groups = updatedInterview.structure.groups.filter((g) => g.groupId !== id);
        setInterview(updatedInterview);
    };

    const onSaveClicked = () => {
        if (isExistingInterviewFlow()) {
            updateInterview(interview);
            message.success(`Interview '${interview.candidate}' updated.`);
        } else if (selectedTemplate.libraryId) {
            const template = {
                ...selectedTemplate,
                structure: interview.structure,
            };
            addInterviewWithTemplate(interview, template);
            personalEvent("Interview created");
            message.success(`Interview '${interview.candidate}' created.`);
        } else {
            addInterview(interview);
            personalEvent("Interview created");
            message.success(`Interview '${interview.candidate}' created.`);
        }
        history.push(routeInterviews());
    };

    const onHeaderChanged = (e) => {
        interview.structure.header = e.target.value;
    };

    const onFooterChanged = (e) => {
        interview.structure.footer = e.target.value;
    };

    const onGroupModalCancel = () => {
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false,
        });
    };

    const onGroupModalUpdate = (id, name) => {
        const updatedInterview = cloneDeep(interview);
        updatedInterview.structure.groups.find((group) => group.groupId === id).name = name;
        setInterview(updatedInterview);
        setQuestionGroupModal(false);
    };

    const onGroupModalAdd = (name) => {
        const groupId = Date.now().toString();
        const updatedInterview = cloneDeep(interview);
        updatedInterview.structure.groups.push({
            groupId: groupId,
            name: name,
            questions: [],
        });
        setInterview(updatedInterview);
        setQuestionGroupModal(false);
    };

    const onMoveGroupUpClicked = (id) => {
        const updatedInterview = cloneDeep(interview);
        const fromIndex = updatedInterview.structure.groups.findIndex((g) => g.groupId === id);
        const toIndex = fromIndex - 1;
        updatedInterview.structure.groups = arrayMove(updatedInterview.structure.groups, fromIndex, toIndex);
        setInterview(updatedInterview);
    };

    const onMoveGroupDownClicked = (id) => {
        const updatedInterview = cloneDeep(interview);
        const fromIndex = updatedInterview.structure.groups.findIndex((g) => g.groupId === id);
        const toIndex = fromIndex + 1;
        updatedInterview.structure.groups = arrayMove(updatedInterview.structure.groups, fromIndex, toIndex);
        setInterview(updatedInterview);
    };

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    const onPreviewClicked = () => {
        setPreviewModalVisible(true);
    };

    const onTemplateSelect = (value) => {
        let personalTemplate = templates.find((template) => template.templateId === value);

        if (personalTemplate) {
            setInterview({
                ...interview,
                templateId: personalTemplate.templateId,
                structure: cloneDeep(personalTemplate.structure),
            });
            setSelectedTemplate(personalTemplate);
            setSelectedTemplateCollapsed(true);
        } else {
            setInterview({
                ...interview,
                libraryId: null,
                templateId: null,
                structure: [],
            });
            setSelectedTemplate(null);
            setSelectedTemplateCollapsed(true);
        }
    };

    const onCollapseClicked = () => {
        setSelectedTemplateCollapsed(!selectedTemplateCollapsed);
    };

    const onCreateTemplateClicked = () => {
        history.push(routeTemplateNew());
    };

    const marginTop12 = { marginTop: 12 };
    const marginVertical12 = { marginTop: 12, marginBottom: 12 };
    const marginTop16 = { marginTop: 16 };

    const TemplateInformation = () => (
        <Card style={marginTop12} loading={isInitialLoading()}>
            <Space direction="vertical">
                <Title level={4} style={{ margin: 0 }}>
                    Template - {selectedTemplate.title}
                </Title>
                <Text type="secondary">Customize an interview template to match any of your processes.</Text>

                {selectedTemplateCollapsed && (
                    <Button onClick={onCollapseClicked}>Show template details</Button>
                )}
                {!selectedTemplateCollapsed && (
                    <Button onClick={onCollapseClicked}>Hide template details</Button>
                )}
            </Space>
        </Card>
    );

    const TemplateDetails = () => (
        <div>
            <Card style={marginTop12}>
                <Title level={4}>Intro</Title>
                <Text type="secondary">
                    This section serves as a reminder for what interviewer must do at the beginning of the
                    interview.
                </Text>
                <TextArea
                    style={marginTop16}
                    defaultValue={interview.structure.header}
                    onChange={onHeaderChanged}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable."
                />
            </Card>

            <Card style={marginTop12}>
                <Space style={{ width: "100%" }}>
                    <Title level={4}>Questions</Title>
                    <Popover
                        content={
                            <img
                                alt="Interviewer"
                                style={{ width: 400 }}
                                src={process.env.PUBLIC_URL + "/app/interview-schedule-groups.png"}
                            />
                        }
                    >
                        <InfoCircleOutlined style={{ marginBottom: 12, cursor: "pointer" }} />
                    </Popover>
                </Space>
                <Text type="secondary">
                    Grouping questions helps to evaluate skills in a particular competence area and make a
                    more granular assessment.
                </Text>
                <div>
                    {interview.structure.groups.map((group) => (
                        <TemplateQuestionsCard
                            template={interview}
                            group={group}
                            onQuestionsSortChange={onQuestionsSortChange}
                            onAddQuestionClicked={onAddQuestionClicked}
                            onRemoveQuestionClicked={onRemoveQuestionClicked}
                            onGroupTitleClicked={onGroupTitleClicked}
                            onDeleteGroupClicked={onDeleteGroupClicked}
                            onMoveGroupUpClicked={onMoveGroupUpClicked}
                            onMoveGroupDownClicked={onMoveGroupDownClicked}
                        />
                    ))}
                </div>
                <Button
                    style={marginTop12}
                    icon={<PlusOutlined />}
                    type="primary"
                    ghost
                    onClick={onAddQuestionGroupClicked}
                >
                    New question group
                </Button>
            </Card>

            <Card style={marginVertical12}>
                <Title level={4}>End of interview</Title>
                <Text type="secondary">
                    This section serves as a reminder for what interviewer must do at the end of the
                    interview. It also contains fields to take notes and make a final assessment.
                </Text>
                <TextArea
                    style={marginTop16}
                    defaultValue={interview.structure.footer}
                    onChange={onFooterChanged}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder="Allow 10 minutes at the end for the candidate to ask questions."
                />
            </Card>
        </div>
    );

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
            <Text type="secondary">
                Enter interview details information so you can easily discover it among other interviews.
            </Text>
            <Form
                name="basic"
                layout="vertical"
                initialValues={{
                    template: interview.templateId || interview.libraryId,
                    candidate: interview.candidate,
                    date: getDate(interview.interviewDateTime, undefined),
                    position: interview.position ? interview.position : undefined,
                    interviewers: interview.interviewers || []
                }}
                onFinish={onSaveClicked}
            >
                <Row gutter={16} style={marginTop16}>
                    <Col span={12}>
                        <Form.Item
                            name="template"
                            label={<Text strong>Template</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select interview template",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Select interview template"
                                onChange={onTemplateSelect}
                                options={templateOptions}
                                filterOption={filterOptionLabel}
                                notFoundContent={<Text>No template found.</Text>}
                                dropdownRender={(menu) => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: "4px 0" }} />
                                        <Button
                                            style={{ paddingLeft: 12 }}
                                            onClick={onCreateTemplateClicked}
                                            type="link"
                                        >
                                            Create new template
                                        </Button>
                                    </div>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="candidate"
                            label={<Text strong>Candidate</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter candidate name",
                                },
                            ]}
                        >
                            <Input
                                className="fs-mask"
                                placeholder="Enter candidate full name"
                                onChange={onCandidateChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {isTeamSpace() && <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="interviewers"
                            label={<Text strong>Interviewers</Text>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select at least 1 interviewer",
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select interviewers"
                                options={interviewersOptions}
                                filterOption={filterOptionLabel}
                                onChange={onInterviewersChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="position"
                            label={<Text strong>Position</Text>}
                        >
                            <AutoComplete
                                allowClear
                                placeholder="Select position you are hiring for"
                                options={sortBy(POSITIONS, ["value"])}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onChange={onPositionChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="date"
                            label={<Text strong>Interview Date</Text>}
                        >
                            <DatePicker
                                showTime={{
                                    minuteStep: 15
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
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </div>
            </Form>
        </Card>
    );

    return (
        <Layout>
            {isInitialLoading() ? <Spinner /> :
                <Row className={styles.rootContainer}>
                    <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                        <InterviewDetails />

                        {selectedTemplate && isExistingInterviewFlow() && <TemplateInformation />}

                        {!selectedTemplateCollapsed && <TemplateDetails />}
                    </Col>
                </Row>
            }

            <TemplateGroupModal
                visible={questionGroupModal.visible}
                name={questionGroupModal.name}
                id={questionGroupModal.id}
                onCancel={onGroupModalCancel}
                onAdd={onGroupModalAdd}
                onUpdate={onGroupModalUpdate}
            />

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
    loadTeamMembers
};
const mapState = (state) => {
    const interviewState = state.interviews || {};
    const templateState = state.templates || {};
    const userState = state.user || {};

    return {
        interviews: interviewState.interviews,
        templates: templateState.templates,
        teamMembers: userState.teamMembers || [],
        activeTeam: userState.activeTeam,
    };
};

export default connect(mapState, mapDispatch)(InterviewSchedule);

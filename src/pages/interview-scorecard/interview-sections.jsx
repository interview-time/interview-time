import styles from "./interview-sections.module.css";
import React from "react";
import { Button, Card, Col, Dropdown, Input, Menu, message, Modal, Row, Space, Table, Tag, Tooltip } from "antd";
import {
    createTagColors,
    DATE_FORMAT_DISPLAY,
    InterviewAssessment,
    Status,
} from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { localeCompare, localeCompareArray } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { ArrowLeftOutlined, CloseOutlined, DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
    AddNoteIcon,
    CollapseIcon,
    ExpandIcon,
    NoteIcon,
    StarEmphasisIcon,
    StarFilledIcon,
    StarHalfIcon,
    StarIcon,
} from "../../components/utils/icons";
import { interviewToTags } from "../../components/utils/converters";
import confirm from "antd/lib/modal/confirm";
import { isEmpty } from "../../components/utils/utils";
import { Link } from "react-router-dom";

const { TextArea } = Input;

/**
 *
 * @param {Interview} interview
 * @param onCloseClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewPreviewCard = ({ interview, onCloseClicked }) => {
    const marginTop12 = { marginTop: 12 };
    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Interview
                </Title>
                <CloseOutlined onClick={onCloseClicked} style={{ cursor: "pointer" }} />
            </div>
            <Card style={{ marginTop: 12, marginBottom: 12 }}>
                <IntroSection interview={interview} />
            </Card>
            <InterviewGroupsSection interview={interview} />
            <Card style={marginTop12}>
                <SummarySection interview={interview} />
            </Card>
        </div>
    );
};

/**
 *
 * @param {Template} template
 * @param onCloseClicked
 * @param onEditClicked
 * @param onCopyClicked
 * @param onDeleteClicked
 * @param onCreateInterviewClicked
 * @param onCreateTemplateClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplatePreviewCard = ({
    template,
    onCloseClicked,
    onEditClicked,
    onCopyClicked,
    onDeleteClicked,
    onCreateInterviewClicked,
    onCreateTemplateClicked,
}) => {
    const marginTop12 = { marginTop: 12 };

    const showDeleteConfirm = () => {
        confirm({
            title: `Delete '${template.title}' Template`,
            icon: <ExclamationCircleOutlined />,
            content: "Are you sure you want to delete this template?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                onDeleteClicked(template);
            },
        });
    };

    return (
        <div>
            <Card>
                <div className={styles.header} style={{ marginBottom: 24 }}>
                    <div className={styles.headerTitleContainer} onClick={onCloseClicked}>
                        <ArrowLeftOutlined />{" "}
                        <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                            Interview Template - {template.title}
                        </Title>
                    </div>
                </div>

                <Text>Use this template to schedule new interview and customize as you go.</Text>

                <div className={styles.divSpaceBetween} style={marginTop12}>
                    {template.libraryId && (
                        <Button type="primary" onClick={onCreateTemplateClicked}>
                            Use template
                        </Button>
                    )}
                    {template.templateId && (
                        <Button type="primary" onClick={onCreateInterviewClicked}>
                            Schedule interview
                        </Button>
                    )}
                    {template.templateId && (
                        <Space>
                            <Button
                                type="link"
                                danger
                                onClick={() => {
                                    showDeleteConfirm();
                                }}
                            >
                                Delete
                            </Button>
                            <Button type="link" onClick={onCopyClicked}>
                                Copy
                            </Button>
                            <Button type="link" onClick={onEditClicked}>
                                Edit
                            </Button>
                        </Space>
                    )}
                </div>
            </Card>
            <Card style={{ marginTop: 12, marginBottom: 12 }}>
                <IntroSection interview={template} />
            </Card>
            <TemplateGroupsSection template={template} />
            <Card style={marginTop12}>
                <SummarySection interview={template} />
            </Card>
        </div>
    );
};

/**
 *
 * @param {Template} template
 * @param onCloseClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateDetailsPreviewCard = ({ template, onCloseClicked }) => {
    const marginTop12 = { marginTop: 12 };
    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Interview Template - {template.title}
                </Title>
                <CloseOutlined onClick={onCloseClicked} style={{ cursor: "pointer" }} />
            </div>
            <Card style={{ marginTop: 12, marginBottom: 12 }}>
                <IntroSection interview={template} />
            </Card>
            <TemplateGroupsSection template={template} />
            <Card style={marginTop12}>
                <SummarySection interview={template} />
            </Card>
        </div>
    );
};

/**
 *
 * @param {boolean} loading
 * @param {String} title
 * @param {Interview} interview
 * @param onDeleteInterview
 * @param onEditInterview
 * @param onBackClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewInformationSection = ({
    loading,
    title,
    interview,
    onDeleteInterview,
    onEditInterview,
    onBackClicked,
}) => {
    const onDeleteClicked = () => {
        Modal.confirm({
            title: "Delete Interview",
            content: "Are you sure that you want to delete this interview?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                onDeleteInterview();
                message.success(`Interview '${interview.candidate}' removed.`);
            },
        });
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={onEditInterview}>Edit Interview</Menu.Item>
            <Menu.Item onClick={onDeleteClicked}>Delete Interview</Menu.Item>
        </Menu>
    );

    return (
        <Card loading={loading}>
            <div className={styles.divSpaceBetween}>
                <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                    <ArrowLeftOutlined />{" "}
                    <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                        {title}
                    </Title>
                </div>
                <Dropdown overlay={menu}>
                    <Link>Actions <DownOutlined /></Link>
                </Dropdown>
            </div>
            <Row style={{ marginTop: "24px" }}>
                <Col flex="140px">
                    <Space direction="vertical">
                        <Text type="secondary">Candidate Name:</Text>
                        <Text type="secondary">Position:</Text>
                        <Text type="secondary">Interview Date:</Text>
                    </Space>
                </Col>
                <Col flex="1">
                    <Space direction="vertical">
                        <Text>{interview.candidate}</Text>
                        <Text>{interview.position}</Text>
                        <Text>{moment(interview.interviewDateTime).format(DATE_FORMAT_DISPLAY)}</Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

/**
 *
 * @param {(Interview|Template)} interview
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const IntroSection = ({ interview, hashStyle }) => {
    const getHeader = () => {
        if (interview && interview.structure && interview.structure.header) {
            return interview.structure.header;
        } else {
            return "Intro text is empty.";
        }
    };

    return (
        <>
            <Title id="intro" level={4} className={hashStyle ? hashStyle : null}>
                Intro
            </Title>
            <div className={styles.multiLineText}>{getHeader()}</div>
        </>
    );
};

/**
 *
 * @param {(Interview|Template)} interview
 * @param onNoteChanges
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const SummarySection = ({ interview, onNoteChanges, hashStyle }) => {
    const getFooter = () => {
        if (interview && interview.structure && interview.structure.footer) {
            return interview.structure.footer;
        } else {
            return "End of interview text is empty.";
        }
    };

    return (
        <>
            <Title id="summary" level={4} className={hashStyle ? hashStyle : null}>
                End of interview
            </Title>
            <div className={styles.multiLineText}>{getFooter()}</div>
        </>
    );
};

/**
 *
 * @param {number} index
 * @param {Map<string, string>} tagColors
 * @param {InterviewGroup} group
 * @param {boolean} disabled
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewQuestionsCard = ({
    index,
    tagColors,
    group,
    disabled,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    hashStyle,
}) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [hoverIndex, setHoverIndex] = React.useState(-1);

    const columns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            sortDirections: ["descend", "ascend"],
            className: styles.multiLineText,
            shouldCellUpdate: (record, prevRecord) => record.question !== prevRecord.question,
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            width: 250,
            shouldCellUpdate: (record, prevRecord) => record.tags !== prevRecord.tags,
            sorter: (a, b) => localeCompareArray(a.tags, b.tags),
            render: (tags) => (
                <>
                    {defaultTo(tags, []).map((tag) => {
                        return (
                            <Tag key={tag} className={styles.tag} color={tagColors.get(tag)}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: "Assessment",
            width: 140,
            shouldCellUpdate: (record, prevRecord) => record.assessment !== prevRecord.assessment,
            render: (question) => (
                <AssessmentCheckbox
                    defaultValue={question.assessment}
                    disabled={disabled}
                    onChange={(value) => {
                        if (onQuestionAssessmentChanged) {
                            onQuestionAssessmentChanged(question, value);
                        }
                    }}
                />
            ),
        },
        { title: "", dataIndex: "", key: "expand", width: 1 },
    ];

    const blueIconStyle = { color: "#1890FF", fontSize: 18 };
    const greyIconStyle = { color: "#000000d9", fontSize: 18 };
    const whiteIconStyle = { color: "#FFFFFF", fontSize: 18 };

    const onCollapseClicked = () => {
        setCollapsed(!collapsed);
    };
    return (
        <Card style={index === 0 ? { marginTop: 0 } : { marginTop: 12 }}>
            <div className={styles.divSpaceBetween}>
                <Space style={{ marginBottom: 8 }}>
                    <Title
                        id={group.name}
                        level={4}
                        onClick={onCollapseClicked}
                        style={{ cursor: "pointer", marginBottom: 0 }}
                        className={hashStyle ? hashStyle : null}
                    >
                        {group.name}
                    </Title>
                    <Text type="secondary">{group.questions.length} questions</Text>
                </Space>
                {collapsed && (
                    <Tooltip title="Expand group">
                        <ExpandIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                    </Tooltip>
                )}
                {!collapsed && (
                    <Tooltip title="Collapse group">
                        <CollapseIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                    </Tooltip>
                )}
            </div>
            {!collapsed && (
                <div>
                    <Card bodyStyle={{ padding: 0 }}>
                        <Table
                            columns={columns}
                            dataSource={group.questions.map((question, index) => {
                                question.key = index;
                                return question;
                            })}
                            pagination={false}
                            expandable={{
                                expandIconColumnIndex: 4,
                                expandedRowRender: (question) => (
                                    <TextArea
                                        className={styles.questionTextArea}
                                        placeholder="Notes..."
                                        bordered={false}
                                        autoSize={true}
                                        autoFocus={true}
                                        defaultValue={question.notes}
                                        onChange={(e) => (question.notes = e.target.value)}
                                    />
                                ),
                                expandIcon: ({ expanded, onExpand, record }) => {
                                    if (expanded) {
                                        if (hoverIndex === record.key) {
                                            return (
                                                <NoteIcon
                                                    style={blueIconStyle}
                                                    onClick={(e) => onExpand(record, e)}
                                                />
                                            );
                                        } else {
                                            return (
                                                <NoteIcon
                                                    style={greyIconStyle}
                                                    onClick={(e) => onExpand(record, e)}
                                                />
                                            );
                                        }
                                    } else {
                                        if (hoverIndex === record.key) {
                                            return (
                                                <AddNoteIcon
                                                    style={blueIconStyle}
                                                    onClick={(e) => onExpand(record, e)}
                                                />
                                            );
                                        } else if (!isEmpty(record.notes)) {
                                            return (
                                                <NoteIcon
                                                    style={greyIconStyle}
                                                    onClick={(e) => onExpand(record, e)}
                                                />
                                            );
                                        } else {
                                            return (
                                                <AddNoteIcon
                                                    style={whiteIconStyle}
                                                    onClick={(e) => onExpand(record, e)}
                                                />
                                            );
                                        }
                                    }
                                },
                            }}
                            onRow={(record, rowIndex) => {
                                return {
                                    onMouseEnter: (event) => setHoverIndex(rowIndex),
                                    onMouseLeave: (event) => setHoverIndex(-1),
                                };
                            }}
                        />
                    </Card>
                </div>
            )}
        </Card>
    );
};

/**
 *
 * @param {string} assessment
 * @param {boolean} disabled
 * @param onAssessmentChanged
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewAssessmentButtons = ({ assessment, disabled, onAssessmentChanged }) => {
    const [activeAssessment, setActiveAssessment] = React.useState(assessment);

    const onButtonClicked = (groupAssessment) => {
        if (!disabled) {
            if (activeAssessment === groupAssessment) {
                setActiveAssessment(null);
            } else {
                setActiveAssessment(groupAssessment);
            }
            onAssessmentChanged(groupAssessment);
        }
    };

    const getAssessmentTextBlue = (assessment) =>
        activeAssessment === assessment ? styles.assessmentTextGreen : styles.assessmentText;

    const getAssessmentTextRed = (assessment) =>
        activeAssessment === assessment ? styles.assessmentTextRed : styles.assessmentText;

    const getAssessmentButtonBlue = (assessment) =>
        activeAssessment === assessment ? styles.assessmentButtonGreenActive : styles.assessmentButtonGreen;

    const getAssessmentButtonRed = (assessment) =>
        activeAssessment === assessment ? styles.assessmentButtonRedActive : styles.assessmentButtonRed;

    const getAssessmentIconStyle = (assessment) =>
        activeAssessment === assessment ? styles.assessmentIconActive : styles.assessmentIcon;

    return (
        <Space size={16}>
            <div
                className={getAssessmentButtonRed(InterviewAssessment.STRONG_NO)}
                onClick={() => onButtonClicked(InterviewAssessment.STRONG_NO)}
            >
                <StarIcon className={getAssessmentIconStyle(InterviewAssessment.STRONG_NO)} />
                <Text className={getAssessmentTextRed(InterviewAssessment.STRONG_NO)}>strong no</Text>
            </div>
            <div
                className={getAssessmentButtonRed(InterviewAssessment.NO)}
                onClick={() => onButtonClicked(InterviewAssessment.NO)}
            >
                <StarHalfIcon className={getAssessmentIconStyle(InterviewAssessment.NO)} />
                <Text className={getAssessmentTextRed(InterviewAssessment.NO)}>no</Text>
            </div>
            <div
                className={getAssessmentButtonBlue(InterviewAssessment.YES)}
                onClick={() => onButtonClicked(InterviewAssessment.YES)}
            >
                <StarFilledIcon className={getAssessmentIconStyle(InterviewAssessment.YES)} />
                <Text className={getAssessmentTextBlue(InterviewAssessment.YES)}>yes</Text>
            </div>
            <div
                className={getAssessmentButtonBlue(InterviewAssessment.STRONG_YES)}
                onClick={() => onButtonClicked(InterviewAssessment.STRONG_YES)}
            >
                <StarEmphasisIcon className={getAssessmentIconStyle(InterviewAssessment.STRONG_YES)} />
                <Text className={getAssessmentTextBlue(InterviewAssessment.STRONG_YES)}>strong yes</Text>
            </div>
        </Space>
    );
};

/**
 *
 * @param {Interview} interview
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewGroupsSection = ({
    interview,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    hashStyle,
}) => {
    const isCompletedStatus = () => interview.status === Status.COMPLETED;
    const tagColors = createTagColors(interviewToTags(interview));

    return (
        <>
            {interview.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    index={index}
                    tagColors={tagColors}
                    group={group}
                    disabled={isCompletedStatus()}
                    onGroupAssessmentChanged={onGroupAssessmentChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    hashStyle={hashStyle}
                />
            ))}
        </>
    );
};

/**
 *
 * @param {(Template)} template
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateGroupsSection = ({
    template,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    hashStyle,
}) => {
    const tagColors = createTagColors(interviewToTags(template));

    return (
        <>
            {template.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    index={index}
                    tagColors={tagColors}
                    group={group}
                    disabled={false}
                    onGroupAssessmentChanged={onGroupAssessmentChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    hashStyle={hashStyle}
                />
            ))}
        </>
    );
};

import styles from "./interview-sections.module.css";
import React from "react";
import { Card, Col, Dropdown, Grid, Input, Menu, message, Modal, Row, Space, Switch, Table, Tag, Tooltip, } from "antd";
import { createTagColors, InterviewAssessment, Status, } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { localeCompare, localeCompareArray } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { CloseOutlined, DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import { NoteIcon, StarEmphasisIcon, StarFilledIcon, StarHalfIcon, StarIcon, } from "../../components/utils/icons";
import { interviewToTags } from "../../components/utils/converters";
import { getFormattedDate, isEmpty } from "../../components/utils/utils";

const { TextArea } = Input;
const { useBreakpoint } = Grid;

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
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewInformationSection = ({
    loading,
    title,
    interview,
    onDeleteInterview,
    onEditInterview,
}) => {
    const onDeleteClicked = () => {
        Modal.confirm({
            title: "Delete Interview",
            content: "Are you sure that you want to delete this interview-schedule?",
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
            <Menu.Item onClick={onDeleteClicked}>
                <DeleteOutlined /> Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Card loading={loading}>
            <div className={styles.divSpaceBetween}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    {title}
                </Title>
                {(onDeleteInterview || onEditInterview) && (
                    <Dropdown.Button overlay={menu} onClick={onEditInterview}>
                        <EditOutlined /> Edit
                    </Dropdown.Button>
                )}
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
                        <Text className="fs-mask">{interview.candidate}</Text>
                        <Text className="fs-mask">{defaultTo(interview.position, "-")}</Text>
                        <Text>{getFormattedDate(interview.interviewDateTime, "-")}</Text>
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
                💡 Interview reminders
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
export const SummarySection = ({ interview, hashStyle }) => {
    const getFooter = () => {
        if (interview && interview.structure && interview.structure.footer) {
            return interview.structure.footer;
        } else {
            return "End of interview-schedule text is empty.";
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
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    hashStyle,
}) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const screens = useBreakpoint();

    const columns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            sortDirections: ["descend", "ascend"],
            className: styles.questionCell,
            shouldCellUpdate: (record, prevRecord) => record.question !== prevRecord.question,
            sorter: (a, b) => localeCompare(a.question, b.question),
            render: (question) => {
                return <span className="fs-mask" style={{paddingLeft: 8 }}>{question}</span>;
            },
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            responsive: ['lg'], // hide tags for 'lg' devices
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
                    key={question.questionId}
                    defaultValue={question.assessment}
                    disabled={disabled}
                    onChange={(value) => {
                        if (onQuestionAssessmentChanged) {
                            onQuestionAssessmentChanged(question.questionId, value);
                        }
                    }}
                />
            ),
            onCell: (record, rowIndex) => {
                return {
                    onClick: (event) => event.stopPropagation(),
                };
            },
        },
        {
            title: "Notes",
            dataIndex: "",
            key: "notes",
            width: 48
        },
    ];

    const primaryIconStyle = { color: "#8C2BE3", fontSize: 18 };
    const greyIconStyle = { color: "#9CA3AF", fontSize: 18 };

    const onCollapseClicked = () => {
        setCollapsed(!collapsed);
    };
    return (
        <div className={styles.tableContainer}>
            <div className={styles.questionsHeaderContainer}>
                <Space>
                    <Title
                        id={group.name}
                        level={4}
                        onClick={onCollapseClicked}
                        style={{ cursor: "pointer", marginBottom: 0, color: !collapsed ? '#000000d9' : '#C4C4C4' }}
                        className={hashStyle ? hashStyle : null}
                    >
                        {group.name}
                    </Title>
                    <span style={{ color: !collapsed ? '#6B7280' : '#C4C4C4' }}>
                        ({group.questions.length} questions)
                    </span>
                </Space>
                <Tooltip title={!collapsed ? "Included in interview" : "Excluded from interview"}>
                    <Switch checked={!collapsed} onClick={onCollapseClicked} />
                </Tooltip>
            </div>
            {!collapsed && (
                <div>
                    <div className={styles.divider} />
                    <Table
                        columns={columns}
                        scroll={{
                            x: screens.lg ? false : 'max-content' // turn off table scrolling for 'lg' devices
                        }}
                        dataSource={group.questions.map((question, index) => {
                            question.key = index;
                            return question;
                        })}
                        pagination={false}
                        showHeader={false}
                        expandable={
                            !disabled
                                ? {
                                    expandIconColumnIndex: 4,
                                    expandRowByClick: true,
                                    defaultExpandedRowKeys: group.questions.map((question, index) => {
                                        if (question.notes) return index;
                                        return null;
                                    }),
                                    expandedRowRender: (question) => (
                                        <TextArea
                                            className={styles.questionNotesArea + " fs-mask"}
                                            placeholder="Notes"
                                            bordered={false}
                                            autoSize={true}
                                            autoFocus={true}
                                            defaultValue={question.notes}
                                            onChange={(e) => {
                                                if (onQuestionNotesChanged) {
                                                    onQuestionNotesChanged(
                                                        question.questionId,
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                        />
                                    ),
                                    expandIcon: ({ onExpand, record }) =>
                                        !isEmpty(record.notes) ? (
                                            <NoteIcon
                                                style={primaryIconStyle}
                                                onClick={(e) => onExpand(record, e)}
                                            />
                                        ) : (
                                            <NoteIcon
                                                style={greyIconStyle}
                                                onClick={(e) => onExpand(record, e)}
                                            />
                                        ),
                                }
                                : null
                        }
                    />
                </div>
            )}
        </div>
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
                className={`${styles.assessmentButton} ${getAssessmentButtonRed(InterviewAssessment.STRONG_NO)}`}
                onClick={() => onButtonClicked(InterviewAssessment.STRONG_NO)}
            >
                <StarIcon className={getAssessmentIconStyle(InterviewAssessment.STRONG_NO)} />
                <Text className={getAssessmentTextRed(InterviewAssessment.STRONG_NO)}>strong no</Text>
            </div>
            <div
                className={`${styles.assessmentButton} ${getAssessmentButtonRed(InterviewAssessment.NO)}`}
                onClick={() => onButtonClicked(InterviewAssessment.NO)}
            >
                <StarHalfIcon className={getAssessmentIconStyle(InterviewAssessment.NO)} />
                <Text className={getAssessmentTextRed(InterviewAssessment.NO)}>no</Text>
            </div>
            <div
                className={`${styles.assessmentButton} ${getAssessmentButtonBlue(InterviewAssessment.YES)}`}
                onClick={() => onButtonClicked(InterviewAssessment.YES)}
            >
                <StarFilledIcon className={getAssessmentIconStyle(InterviewAssessment.YES)} />
                <Text className={getAssessmentTextBlue(InterviewAssessment.YES)}>yes</Text>
            </div>
            <div
                className={`${styles.assessmentButton} ${getAssessmentButtonBlue(InterviewAssessment.STRONG_YES)}`}
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
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    hashStyle,
}) => {
    const isCompletedStatus = () => interview.status === Status.COMPLETED;
    const tagColors = createTagColors(interviewToTags(interview));

    return (
        <>
            {interview.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    key={group.groupId}
                    index={index}
                    tagColors={tagColors}
                    group={group}
                    disabled={isCompletedStatus()}
                    onQuestionNotesChanged={onQuestionNotesChanged}
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
 * @param disabled
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateGroupsSection = ({
    template,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    hashStyle,
    disabled,
}) => {
    const tagColors = createTagColors(interviewToTags(template));

    return (
        <>
            {template.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    key={group.groupId}
                    index={index}
                    tagColors={tagColors}
                    group={group}
                    disabled={disabled}
                    onGroupAssessmentChanged={onGroupAssessmentChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    hashStyle={hashStyle}
                />
            ))}
        </>
    );
};

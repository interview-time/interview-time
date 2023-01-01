import styles from "./interview-sections.module.css";
import React from "react";
import { Dropdown, Grid, Input, Menu, Space, Table, Tag } from "antd";
import { InterviewAssessment, Status } from "../../../../utils/constants";
import { defaultTo } from "lodash/util";
import { Typography } from "antd";
import { localeCompare, localeCompareArray } from "../../../../utils/comparators";
import AssessmentCheckbox from "../../../../components/questions/assessment-checkbox";
import { CloseOutlined } from "@ant-design/icons";
import {
    MoreIcon,
    NoteIcon,
    StarEmphasisIcon,
    StarFilledIcon,
    StarHalfIcon,
    StarIcon
} from "../../../../utils/icons";
import { isEmpty } from "../../../../utils/date";
import Card from "../../../../components/card/card";
import QuestionDifficultyTag from "../../../../components/tags/question-difficulty-tag";
import { getTagColor } from "../../../../utils/colors";

const { Title, Text } = Typography;
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
        </div>
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
            <Title id='intro' level={4} className={hashStyle ? hashStyle : null}>
                💡 Interview reminders
            </Title>
            <div className={styles.multiLineText}>{getHeader()}</div>
        </>
    );
};

/**
 *
 * @param {number} index
 * @param {InterviewGroup|TemplateGroup} group
 * @param {boolean} disabled
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param onRemoveGroupClicked
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewQuestionsCard = ({
    index,
    group,
    disabled,
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    onRemoveGroupClicked,
    hashStyle,
}) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [tagsVisible, setTagsVisible] = React.useState(true);
    const screens = useBreakpoint();

    const columns = [
        {
            dataIndex: "difficulty",
            key: "difficulty",
            render: difficulty => {
                return {
                    props: {
                        style: { padding: 0 },
                    },
                    children: <QuestionDifficultyTag difficulty={difficulty} />,
                };
            },
        },
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            sortDirections: ["descend", "ascend"],
            className: styles.questionCell,
            width: '100%',
            shouldCellUpdate: (record, prevRecord) => record.question !== prevRecord.question,
            sorter: (a, b) => localeCompare(a.question, b.question),
            render: question => {
                return {
                    props: {
                        style: { padding: 0 },
                    },
                    children: <span>{question}</span>,
                };
            },
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            responsive: [tagsVisible ? "lg" : "xxl"], // hide tags for 'lg' devices
            width: 250,
            shouldCellUpdate: (record, prevRecord) => record.tags !== prevRecord.tags,
            sorter: (a, b) => localeCompareArray(a.tags, b.tags),
            render: tags => (
                <>
                    {defaultTo(tags, []).map(tag => {
                        return (
                            <Tag key={tag} className={styles.tag} color={getTagColor(tag)}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: "Assessment",
            shouldCellUpdate: (record, prevRecord) => record.assessment !== prevRecord.assessment,
            render: question => (
                <AssessmentCheckbox
                    key={question.questionId}
                    defaultValue={question.assessment}
                    disabled={disabled}
                    onChange={value => {
                        if (onQuestionAssessmentChanged) {
                            onQuestionAssessmentChanged(question.questionId, value);
                        }
                    }}
                />
            ),
            onCell: (record, rowIndex) => {
                return {
                    onClick: event => event.stopPropagation(),
                };
            },
        },
        {
            title: "Notes",
            dataIndex: "",
            key: "notes",
            width: 48,
        },
    ];

    const primaryIconStyle = { color: "#8C2BE3", fontSize: 18 };
    const greyIconStyle = { color: "#9CA3AF", fontSize: 18 };

    const onCollapseClicked = () => {
        setCollapsed(!collapsed);
    };

    const onTagsClicked = () => {
        setTagsVisible(!tagsVisible);
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={onCollapseClicked}>{!collapsed ? "Collapse section" : "Expand section"}</Menu.Item>
            <Menu.Item onClick={onTagsClicked}>{tagsVisible ? "Hide tags" : "Show tags"}</Menu.Item>
            {onRemoveGroupClicked && (
                <>
                    <Menu.Divider />
                    <Menu.Item danger onClick={() => onRemoveGroupClicked(group)}>
                        Remove section
                    </Menu.Item>
                </>
            )}
        </Menu>
    );

    return (
        <Card withPadding={false}>
            <div className={styles.questionsHeaderContainer}>
                <Space>
                    <Title
                        id={group.name}
                        level={4}
                        onClick={onCollapseClicked}
                        style={{ cursor: "pointer", marginBottom: 0, color: !collapsed ? "#000000d9" : "#C4C4C4" }}
                        className={hashStyle ? hashStyle : null}
                    >
                        {group.name}
                    </Title>
                    <span style={{ color: !collapsed ? "#6B7280" : "#C4C4C4" }}>
                        ({group.questions.length} questions)
                    </span>
                </Space>
                <Dropdown overlay={menu}>
                    <MoreIcon style={{ cursor: "pointer" }} />
                </Dropdown>
            </div>
            {!collapsed && (
                <div>
                    <div className={styles.divider} />
                    <Table
                        rowClassName='assessment-question-row'
                        columns={columns}
                        scroll={{
                            x: screens.lg ? false : "max-content", // turn off table scrolling for 'lg' devices
                        }}
                        dataSource={group.questions.map((question, index) => {
                            question.key = index;
                            return question;
                        })}
                        pagination={false}
                        showHeader={false}
                        // TODO migrate to expandableNotes utils function
                        expandable={
                            !disabled
                                ? {
                                      expandIconColumnIndex: 5,
                                      expandRowByClick: true,
                                      defaultExpandedRowKeys: group.questions.map((question, index) => {
                                          if (question.notes) return index;
                                          return null;
                                      }),
                                      expandedRowRender: question => (
                                          <TextArea
                                              className={styles.questionNotesArea}
                                              placeholder='Notes'
                                              bordered={false}
                                              autoSize={true}
                                              autoFocus={true}
                                              defaultValue={question.notes}
                                              onChange={e => {
                                                  if (onQuestionNotesChanged) {
                                                      onQuestionNotesChanged(question.questionId, e.target.value);
                                                  }
                                              }}
                                          />
                                      ),
                                      expandIcon: ({ onExpand, record }) =>
                                          !isEmpty(record.notes) ? (
                                              <NoteIcon style={primaryIconStyle} onClick={e => onExpand(record, e)} />
                                          ) : (
                                              <NoteIcon style={greyIconStyle} onClick={e => onExpand(record, e)} />
                                          ),
                                  }
                                : null
                        }
                    />
                </div>
            )}
        </Card>
    );
};

/**
 *
 * @param {number} assessment
 * @param {boolean} disabled
 * @param onAssessmentChanged
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewAssessmentButtons = ({ assessment, disabled, onAssessmentChanged }) => {
    const [activeAssessment, setActiveAssessment] = React.useState(assessment);

    const onButtonClicked = groupAssessment => {
        if (!disabled) {
            if (activeAssessment === groupAssessment) {
                setActiveAssessment(null);
            } else {
                setActiveAssessment(groupAssessment);
            }
            onAssessmentChanged(groupAssessment);
        }
    };

    const getAssessmentTextBlue = assessment =>
        activeAssessment === assessment ? styles.assessmentTextGreen : styles.assessmentText;

    const getAssessmentTextRed = assessment =>
        activeAssessment === assessment ? styles.assessmentTextRed : styles.assessmentText;

    const getAssessmentButtonBlue = assessment =>
        activeAssessment === assessment ? styles.assessmentButtonGreenActive : styles.assessmentButtonGreen;

    const getAssessmentButtonRed = assessment =>
        activeAssessment === assessment ? styles.assessmentButtonRedActive : styles.assessmentButtonRed;

    const getAssessmentIconStyle = assessment =>
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
 * @param onRemoveGroupClicked
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewGroupsSection = ({
    interview,
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    onRemoveGroupClicked,
    hashStyle,
}) => {
    const isCompletedStatus = () => interview.status === Status.COMPLETED;

    return (
        <>
            {interview.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    key={group.groupId}
                    index={index}
                    group={group}
                    disabled={isCompletedStatus()}
                    onRemoveGroupClicked={onRemoveGroupClicked}
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
    return (
        <>
            {template.structure.groups.map((group, index) => (
                <InterviewQuestionsCard
                    key={group.groupId}
                    index={index}
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

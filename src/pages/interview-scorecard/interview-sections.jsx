import styles from "./interview-sections.module.css";
import React from "react";
import { Col, Dropdown, Grid, Input, Menu, message, Modal, Row, Space, Table, Tag } from "antd";
import { getTagColor, InterviewAssessment, Status } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { localeCompare, localeCompareArray } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { CloseOutlined, DeleteOutlined, EditOutlined, GithubFilled, LinkedinFilled } from "@ant-design/icons";
import {
    CalendarIcon,
    MenuIcon,
    NoteIcon,
    StarEmphasisIcon,
    StarFilledIcon,
    StarHalfIcon,
    StarIcon,
    TextNoteIcon,
    TimeIcon,
    UsersIcon,
} from "../../components/utils/icons";
import { getInterviewerName} from "../../components/utils/converters";
import { isEmpty } from "../../components/utils/date";
import Card from "../../components/card/card";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";
import { getFormattedDateTime, getFormattedDate, getFormattedTimeRange } from "../../components/utils/date-fns";

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
    return (
        <div>
            <div className={styles.divSpaceBetween}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Interview Template - {template.title}
                </Title>
                <CloseOutlined onClick={onCloseClicked} style={{ cursor: "pointer" }} />
            </div>
            <Card style={{ marginTop: 32, marginBottom: 32 }}>
                <IntroSection interview={template} />
            </Card>
            <TemplateGroupsSection template={template} />
            <Card style={{ marginTop: 32 }}>
                <SummarySection interview={template} />
            </Card>
        </div>
    );
};
/**
 *
 * @param {Interview} interview
 * @param {TeamMember[]}  teamMembers
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewInfoSection = ({ interview, teamMembers }) => {
    const iconStyle = { fontSize: 20, color: "#374151" };

    // eslint-disable-next-line
    const getInterviewerNameShort = name => {
        let names = name.split(" ");
        if (names.length >= 2) {
            // Dmytro Danylyk -> DD
            return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
        } else if (name.length > 0) {
            // dmytrodanylyk -> D
            return name.charAt(0).toUpperCase();
        } else {
            return "";
        }
    };

    return (
        <Space direction='vertical' size={12}>
            <div className={styles.divHorizontal}>
                <UsersIcon style={iconStyle} />
                <Text className={styles.reportLabel}>{getInterviewerName(teamMembers, interview.userId)}</Text>
            </div>
            <div className={styles.divHorizontal}>
                <CalendarIcon style={iconStyle} />
                <Text className={styles.reportLabel}>{getFormattedDate(interview.interviewDateTime)}</Text>
            </div>
            <div className={styles.divHorizontal}>
                <TimeIcon style={iconStyle} />
                <Text className={styles.reportLabel}>
                    {getFormattedTimeRange(interview.interviewDateTime, interview.interviewEndDateTime)}
                </Text>
            </div>
        </Space>
    );
};

/**
 *
 * @param {Candidate|undefined} candidate
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 */
export const CandidateInfoSection = ({ candidate, className }) => {
    const iconStyle = { fontSize: 20, color: "#374151" };

    const getUrlPathname = url => {
        try {
            return new URL(candidate.linkedIn).pathname;
        } catch (e) {
            return url;
        }
    };

    return (
        <Space className={className} direction='vertical' size={12}>
            {candidate && candidate.linkedIn && (
                <div className={styles.divHorizontal}>
                    <LinkedinFilled style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.linkedIn} target='_blank' rel='noreferrer'>
                        {getUrlPathname(candidate.linkedIn)}
                    </a>
                </div>
            )}
            {candidate && candidate.gitHub && (
                <div className={styles.divHorizontal}>
                    <GithubFilled style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.linkedIn} target='_blank' rel='noreferrer'>
                        {getUrlPathname(candidate.gitHub)}
                    </a>
                </div>
            )}
            {candidate && candidate.resumeUrl && (
                <div className={styles.divHorizontal}>
                    <TextNoteIcon style={iconStyle} />
                    <a className={styles.reportLabel} href={candidate.resumeUrl} target='_blank' rel='noreferrer'>
                        resume.pdf
                    </a>
                </div>
            )}
        </Space>
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
export const InterviewInformationSection = ({ loading, title, interview, onDeleteInterview, onEditInterview }) => {
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
                <Col flex='140px'>
                    <Space direction='vertical'>
                        <Text type='secondary'>Candidate Name:</Text>
                        <Text type='secondary'>Position:</Text>
                        <Text type='secondary'>Interview Date:</Text>
                    </Space>
                </Col>
                <Col flex='1'>
                    <Space direction='vertical'>
                        <Text className='fs-mask'>{interview.candidate}</Text>
                        <Text>{defaultTo(interview.position, "-")}</Text>
                        <Text>{getFormattedDateTime(interview.interviewDateTime, "-")}</Text>
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
            <Title id='intro' level={4} className={hashStyle ? hashStyle : null}>
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
            <Title id='summary' level={4} className={hashStyle ? hashStyle : null}>
                End of interview
            </Title>
            <div className={styles.multiLineText}>{getFooter()}</div>
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
            width: 48,
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
            width: 180,
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
        <Card withPadding={false} style={{ marginTop: 32 }}>
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
                    <MenuIcon style={{ cursor: "pointer" }} />
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
 * @param {string} assessment
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

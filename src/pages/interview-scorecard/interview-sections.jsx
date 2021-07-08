import styles from "./interview-sections.module.css";
import React from 'react';
import { Button, Card, Col, Input, message, Modal, Row, Space, Table, Tag, Tooltip } from "antd";
import { createTagColors, DATE_FORMAT_DISPLAY, GroupAssessment, Status } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { localeCompare, localeCompareArray } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { ArrowLeftOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { routeTemplateDetails } from "../../components/utils/route";
import moment from "moment";
import {
    AddNoteIcon,
    CollapseIcon,
    ExpandIcon,
    NoteIcon,
    StarEmphasisIcon,
    StarFilledIcon,
    StarHalfIcon,
    StarIcon
} from "../../components/utils/icons";
import { interviewToTags } from "../../components/utils/converters";
import { isStickyNotesEnabled } from "../../components/utils/storage";
import confirm from "antd/lib/modal/confirm";
import { isEmpty } from "../../components/utils/utils";

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
    return <div>
        <div className={styles.divSpaceBetween}>
            <Title level={4} style={{ marginBottom: 0 }}>Interview</Title>
            <CloseOutlined onClick={onCloseClicked} style={{ cursor: 'pointer' }} />
        </div>
        <Card style={{marginTop: 12, marginBottom: 12}}>
            <IntroSection interview={interview} />
        </Card>
        <InterviewGroupsSection interview={interview} />
        <Card style={marginTop12}>
            <SummarySection interview={interview} />
        </Card>
    </div>;
}

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
    onCreateTemplateClicked
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

    return <div>
        <Card>
            <div className={styles.header} style={{ marginBottom: 24 }}>
                <div className={styles.headerTitleContainer} onClick={onCloseClicked}>
                    <ArrowLeftOutlined /> <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>Interview Template
                    - {template.title}</Title>
                </div>
            </div>

            <Text>Use this template to schedule new interview and customize as you go.</Text>

            <div className={styles.divSpaceBetween} style={marginTop12}>
                {template.libraryId && <Button type="primary"
                                                onClick={onCreateTemplateClicked}>Use template</Button>}
                {template.templateId && <Button type="primary"
                                                onClick={onCreateInterviewClicked}>Schedule interview</Button>}
                {template.templateId && <Space>
                    <Button type="link" danger onClick={() => {
                        showDeleteConfirm()
                    }}>Delete</Button>
                    <Button type="link" onClick={onCopyClicked}>Copy</Button>
                    <Button type="link" onClick={onEditClicked}>Edit</Button>
                </Space>}
            </div>
        </Card>
        <Card style={{ marginTop: 12, marginBottom: 12 }}>
            <IntroSection interview={template} />
        </Card>
        <TemplateGroupsSection template={template} />
        <Card style={marginTop12}>
            <SummarySection interview={template} />
        </Card>
    </div>;
}

/**
 *
 * @param {Template} template
 * @param onCloseClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateDetailsPreviewCard = ({ template, onCloseClicked }) => {
    const marginTop12 = { marginTop: 12 };
    return <div>
        <div className={styles.divSpaceBetween}>
            <Title level={4} style={{ marginBottom: 0 }}>Interview Template - {template.title}</Title>
            <CloseOutlined onClick={onCloseClicked} style={{ cursor: 'pointer' }} />
        </div>
        <Card style={{marginTop: 12, marginBottom: 12}}>
            <IntroSection interview={template} />
        </Card>
        <TemplateGroupsSection template={template} />
        <Card style={marginTop12}>
            <SummarySection interview={template} />
        </Card>
    </div>;
}

/**
 *
 * @param {boolean} loading
 * @param {String} title
 * @param {String} userName
 * @param {Interview} interview
 * @param {Template} template
 * @param onDeleteInterview
 * @param onEditInterview
 * @param onBackClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewInformationSection = ({
    loading,
    title,
    userName,
    interview,
    template,
    onDeleteInterview,
    onEditInterview,
    onBackClicked
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
            }
        })
    }

    return (
        <Card loading={loading}>
            <div className={styles.header}>
                <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                    <ArrowLeftOutlined /> <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>{title}</Title>
                </div>
            </div>
            <Row style={{marginTop: "24px"}}>
                <Col flex="140px">
                    <Space direction='vertical'>
                        <Text type="secondary">Candidate Name:</Text>
                        <Text type="secondary">Interviewer Name:</Text>
                        <Text type="secondary">Interview Date:</Text>
                    </Space>
                </Col>
                <Col flex="1">
                    <Space direction='vertical'>
                        <Text>{interview.candidate}</Text>
                        <Text>{userName}</Text>
                        <Text>{moment(interview.interviewDateTime).format(DATE_FORMAT_DISPLAY)}</Text>
                    </Space>
                </Col>
                <Col flex="100px">
                    <Space direction='vertical'>
                        <Text type="secondary">Position:</Text>
                        <Text type="secondary">Template:</Text>
                    </Space>
                </Col>
                <Col flex="1">
                    <Space direction='vertical'>
                        <Text>{interview.position}</Text>
                        <Link to={routeTemplateDetails(interview.templateId)} style={{ color: '#000000d9' }}>
                            <span>{template.title ? template.title : null}</span>
                        </Link>
                    </Space>
                </Col>
            </Row>

            <div className={styles.interviewActionButtonContainer}>
                <Space>
                    <Button type="link" danger onClick={onDeleteClicked}>Delete</Button>
                    <Button type="link" onClick={onEditInterview}>Edit</Button>
                </Space>
            </div>
        </Card>
    )
}

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
            return interview.structure.header
        } else {
            return "Intro text is empty."
        }
    }

    return <>
        <Title id="intro" level={4} className={hashStyle ? hashStyle : null}>Intro</Title>
        <div className={styles.multiLineText}>{getHeader()}</div>
    </>
}

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
            return interview.structure.footer
        } else {
            return "Summary text is empty."
        }
    }

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    return <>
        <Title id="summary" level={4}
               className={hashStyle ? hashStyle : null}>Summary</Title>
        <div className={styles.multiLineText}>{getFooter()}</div>
        {!isStickyNotesEnabled() && <Space className={styles.space} direction="vertical">
            <Text strong>Notes</Text>
            <TextArea
                {...(isCompletedStatus() ? { readonly: "true" } : {})}
                placeholder="Capture any key moments that happened during the interview."
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={onNoteChanges}
                defaultValue={interview.notes} />
        </Space>}
    </>
}

/**
 *
 * @param {Interview} interview
 * @param onNoteExpand
 * @param onNoteCollapse
 * @param onNoteChanges
 * @param {boolean} visible
 * @returns {JSX.Element}
 * @constructor
 */
export const NotesSection = ({ interview, onNoteExpand, onNoteCollapse, onNoteChanges, visible }) => {

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    return <>
        {!visible && <div className={styles.stickyFooter}>
            <div className={styles.notes} onClick={() => onNoteExpand()}>
                <Tooltip title="Expand notes">
                    <Text strong>Notes</Text> <CollapseIcon />
                </Tooltip>
            </div>
        </div>}

        {visible && <div className={styles.stickyFooter}>
            <div className={styles.notesExpanded}>
                <div onClick={() => onNoteCollapse()}>
                    <Tooltip title="Collapse notes">
                        <Text strong>Notes</Text> <ExpandIcon />
                    </Tooltip>
                </div>
                <TextArea
                    {...(isCompletedStatus() ? { readonly: "true" } : {})}
                    className={styles.notesTextArea}
                    placeholder="Capture any key moments that happened during the interview."
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    onChange={onNoteChanges}
                    defaultValue={interview.notes} />
            </div>
        </div>}
    </>
}

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
    hashStyle
}) => {

    const [collapsed, setCollapsed] = React.useState(false)
    const [hoverIndex, setHoverIndex] = React.useState(-1)

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            sortDirections: ['descend', 'ascend'],
            className: styles.multiLineText,
            shouldCellUpdate: (record, prevRecord) => record.question !== prevRecord.question,
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: 250,
            shouldCellUpdate: (record, prevRecord) => record.tags !== prevRecord.tags,
            sorter: (a, b) => localeCompareArray(a.tags, b.tags),
            render: tags => (
                <>
                    {defaultTo(tags, []).map(tag => {
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
            title: 'Assessment',
            width: 140,
            shouldCellUpdate: (record, prevRecord) => record.assessment !== prevRecord.assessment,
            render: (question) => <AssessmentCheckbox
                defaultValue={question.assessment}
                disabled={disabled}
                onChange={value => {
                    if (onQuestionAssessmentChanged) {
                        onQuestionAssessmentChanged(question, value)
                    }
                }}
            />
        },
        { title: "", dataIndex: "", key: "expand", width: 1 }
    ];

    const blueIconStyle = { color: "#1890FF", fontSize: 18 }
    const greyIconStyle = { color: "#000000d9", fontSize: 18 }
    const whiteIconStyle = { color: "#FFFFFF", fontSize: 18 }

    const onCollapseClicked = () => {
        setCollapsed(!collapsed)
    }
    return <Card style={ index === 0 ? { marginTop: 0 } : { marginTop: 12 }}>
        <div className={styles.divSpaceBetween}>
            <Space style={{ marginBottom: 8 }}>
                <Title id={group.name} level={4} onClick={onCollapseClicked}
                       style={{ cursor: 'pointer', marginBottom: 0 }}
                       className={hashStyle ? hashStyle : null}>
                    {group.name}
                </Title>
                <Text type="secondary">{group.questions.length} questions</Text>
            </Space>
            {collapsed && <Tooltip title="Expand group">
                <ExpandIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
            </Tooltip>}
            {!collapsed && <Tooltip title="Collapse group">
                <CollapseIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
            </Tooltip>}
        </div>
        {!collapsed && <div>
            <Card bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={group.questions.map((question, index) => {
                        question.key = index
                        return question
                    })}
                    pagination={false}
                    expandable={{
                        expandIconColumnIndex: 4,
                        expandedRowRender: question => (
                            <TextArea
                                className={styles.questionTextArea}
                                placeholder="Notes..."
                                bordered={false}
                                autoSize={true}
                                autoFocus={true}
                                defaultValue={question.notes}
                                onChange={e => question.notes = e.target.value}
                            />
                        ),
                        expandIcon: ({ expanded, onExpand, record }) => {
                            if (expanded) {
                                if (hoverIndex === record.key) {
                                    return <NoteIcon style={blueIconStyle} onClick={e => onExpand(record, e)} />;
                                } else {
                                    return <NoteIcon style={greyIconStyle} onClick={e => onExpand(record, e)} />;
                                }
                            } else {
                                if (hoverIndex === record.key) {
                                    return <AddNoteIcon style={blueIconStyle} onClick={e => onExpand(record, e)} />;
                                } else if (!isEmpty(record.notes)) {
                                    return <NoteIcon style={greyIconStyle} onClick={e => onExpand(record, e)} />;
                                } else {
                                    return <AddNoteIcon style={whiteIconStyle} onClick={e => onExpand(record, e)} />;
                                }
                            }
                        }
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onMouseEnter: event => setHoverIndex(rowIndex),
                            onMouseLeave: event => setHoverIndex(-1),
                        };
                    }}
                />
            </Card>

            <Space className={styles.space} direction="vertical">
                <Text strong>Overall category assessment </Text>
                <GroupAssessmentButtons
                    assessment={group.assessment}
                    disabled={disabled}
                    onGroupAssessmentChanged={(assessment) => {
                        if (onGroupAssessmentChanged) {
                            onGroupAssessmentChanged(group, assessment)
                        }
                    }}
                />
            </Space>
        </div>}
    </Card>
}

/**
 *
 * @param {string} assessment
 * @param {boolean} disabled
 * @param onGroupAssessmentChanged
 * @returns {JSX.Element}
 * @constructor
 */
export const GroupAssessmentButtons = ({ assessment, disabled, onGroupAssessmentChanged }) => {

    const [activeAssessment, setActiveAssessment] = React.useState(assessment)

    const onButtonClicked = (groupAssessment) => {
        if (!disabled) {
            if (activeAssessment === groupAssessment) {
                setActiveAssessment(null)
            } else {
                setActiveAssessment(groupAssessment)
            }
            onGroupAssessmentChanged(groupAssessment)
        }
    }

    const getAssessmentTextBlue = (assessment) => activeAssessment === assessment
        ? styles.assessmentTextBlue : styles.assessmentText

    const getAssessmentTextRed = (assessment) => activeAssessment === assessment
        ? styles.assessmentTextRed : styles.assessmentText

    const getAssessmentButtonBlue = (assessment) => activeAssessment === assessment
        ? styles.assessmentButtonBlueActive : styles.assessmentButtonBlue

    const getAssessmentButtonRed = (assessment) => activeAssessment === assessment
        ? styles.assessmentButtonRedActive : styles.assessmentButtonRed

    const getAssessmentIconStyle = (assessment) => activeAssessment === assessment
        ? styles.assessmentIconActive : styles.assessmentIcon

    return <Space size={16}>
        <div className={getAssessmentButtonRed(GroupAssessment.NO_PROFICIENCY)}
             onClick={() => onButtonClicked(GroupAssessment.NO_PROFICIENCY)}>
            <StarIcon className={getAssessmentIconStyle(GroupAssessment.NO_PROFICIENCY)} />
            <Text className={getAssessmentTextRed(GroupAssessment.NO_PROFICIENCY)}>no proficiency</Text>
        </div>
        <div className={getAssessmentButtonRed(GroupAssessment.LOW_SKILLED)}
             onClick={() => onButtonClicked(GroupAssessment.LOW_SKILLED)}>
            <StarHalfIcon className={getAssessmentIconStyle(GroupAssessment.LOW_SKILLED)} />
            <Text className={getAssessmentTextRed(GroupAssessment.LOW_SKILLED)}>low skills</Text>
        </div>
        <div className={getAssessmentButtonBlue(GroupAssessment.SKILLED)}
             onClick={() => onButtonClicked(GroupAssessment.SKILLED)}>
            <StarFilledIcon className={getAssessmentIconStyle(GroupAssessment.SKILLED)} />
            <Text className={getAssessmentTextBlue(GroupAssessment.SKILLED)}>skilled</Text>
        </div>
        <div className={getAssessmentButtonBlue(GroupAssessment.HIGHLY_SKILLED)}
             onClick={() => onButtonClicked(GroupAssessment.HIGHLY_SKILLED)}>
            <StarEmphasisIcon className={getAssessmentIconStyle(GroupAssessment.HIGHLY_SKILLED)} />
            <Text className={getAssessmentTextBlue(GroupAssessment.HIGHLY_SKILLED)}>highly skilled</Text>
        </div>
    </Space>
}

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
    hashStyle
}) => {

    const isCompletedStatus = () => interview.status === Status.COMPLETED
    const tagColors = createTagColors(interviewToTags(interview))

    return <>
        {interview.structure.groups.map((group, index) =>
            <InterviewQuestionsCard
                index={index}
                tagColors={tagColors}
                group={group}
                disabled={isCompletedStatus()}
                onGroupAssessmentChanged={onGroupAssessmentChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                hashStyle={hashStyle}
            />)
        }
    </>
}

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
    hashStyle
}) => {

    const tagColors = createTagColors(interviewToTags(template))

    return <>
        {template.structure.groups.map((group, index) =>
            <InterviewQuestionsCard
                index={index}
                tagColors={tagColors}
                group={group}
                disabled={false}
                onGroupAssessmentChanged={onGroupAssessmentChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                hashStyle={hashStyle}
            />)
        }
    </>
}
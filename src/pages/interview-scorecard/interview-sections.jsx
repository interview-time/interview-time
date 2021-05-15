import styles from "./interview-sections.module.css";
import React, { useState } from 'react';
import { Card, Col, Dropdown, Input, Menu, message, Modal, Radio, Row, Space, Table, Tag } from "antd";
import { DATE_FORMAT_DISPLAY, GroupAssessment, Status } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { questionIdsToQuestions } from "../../components/utils/converters";
import { localeCompare, localeCompareArray, localeCompareDifficult } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { CaretDownOutlined, CaretRightOutlined, DownOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash/lang";
import { Link } from "react-router-dom";
import { routeInterviewDetails, routeTemplateDetails } from "../../components/utils/route";
import moment from "moment";

const { TextArea } = Input;

/**
 *
 * @param {Interview} interview
 * @param {Template} template
 * @param {string} username
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewPreviewCard = ({ interview, username}) => {

    return <div>
        <InterviewInformationSection
            loading={false}
            userName={username}
            interview={interview}
            template={{}}
        />
        <div style={{marginTop: 64}}>
            <IntroSection interview={interview} />
        </div>
        <GroupsSection interview={interview} />
        <SummarySection interview={interview} />
    </div>
}

/**
 *
 * @param {Template} guide
 * @param {Question[]} questions
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplatePreviewCard = ({ guide, questions }) => {

    /**
     * @type {Interview}
     */
    const emptyInterview = {
        candidate: '',
        position: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    const [interview, setInterview] = useState(emptyInterview)

    React.useEffect(() => {
        if (guide && guide.structure) {
            let interview = {
                structure: {
                    header: guide.structure.header,
                    footer: guide.structure.footer,
                    groups: []
                }
            }
            guide.structure.groups.forEach(group => {
                const interviewGroup = cloneDeep(group)
                const interviewQuestions = questionIdsToQuestions(group.questions, questions)
                interviewGroup.questions = defaultTo(interviewQuestions, [])
                interview.structure.groups.push(interviewGroup)
            })

            setInterview(interview)
        }
        // eslint-disable-next-line
    }, [questions, guide]);

    return <div>
        <IntroSection interview={interview} />
        <GroupsSection interview={interview} />
        <SummarySection interview={interview} />
    </div>
}

/**
 *
 * @param {boolean} loading
 * @param {boolean} showMoreSection
 * @param {String} userName
 * @param {Interview} interview
 * @param {Template} template
 * @param onDeleteInterview
 * @returns {JSX.Element}
 * @constructor
 */
export const InterviewInformationSection = ({
                                                loading,
                                                showMoreSection,
                                                userName,
                                                interview,
                                                template,
                                                onDeleteInterview,
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

    const menu = (
        <Menu >
            <Menu.Item>
                <Link to={routeInterviewDetails(interview.interviewId)}>Edit Interview</Link>
            </Menu.Item>
            <Menu.Item danger onClick={onDeleteClicked}>Delete Interview</Menu.Item>
        </Menu>
    );

    return (
        <Card loading={loading}>
            <Row>
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
                        <Link to={routeTemplateDetails(interview.guideId)} style={{color: '#000000d9'}}>
                            <span>{template.title ? template.title : null}</span>
                        </Link>
                    </Space>
                </Col>
            </Row>

            {showMoreSection && <Dropdown
                className={styles.more}
                overlay={menu}>
                <Link>More <DownOutlined /></Link>
            </Dropdown>}
        </Card>
    )
}

/**
 *
 * @param {Interview} interview
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const IntroSection = ({ interview , hashStyle}) => {

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
 * @param {Interview} interview
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
        <Title id="summary" level={4} style={{marginTop: 64}}
               className={hashStyle ? hashStyle : null}>Summary</Title>
        <div className={styles.multiLineText}>{getFooter()}</div>
        <Space className={styles.space} direction="vertical">
            <Text strong>Notes</Text>
            <TextArea
                {...(isCompletedStatus() ? { readonly: "true" } : {})}
                placeholder="Capture any key moments that happened during the interview."
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={onNoteChanges}
                defaultValue={interview.notes} />
        </Space>
    </>
}

/**
 *
 * @param {InterviewGroup} group
 * @param {boolean} disabled
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param onNotesChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewQuestionsCard = ({
                                    group,
                                    disabled,
                                    onGroupAssessmentChanged,
                                    onQuestionAssessmentChanged,
                                    onNotesChanged,
                                    hashStyle
                                }) => {

    const [collapsed, setCollapsed] = React.useState(false)

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
            sortDirections: ['descend', 'ascend'],
            className: styles.multiLineText,
            sorter: (a, b) => localeCompare(a.question, b.question),
        },
        {
            title: 'Difficulty',
            key: 'difficulty',
            dataIndex: 'difficulty',
            width: 125,
            sorter: (a, b) => localeCompareDifficult(a.difficulty, b.difficulty),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: 250,
            sorter: (a, b) => localeCompareArray(a.tags, b.tags),
            render: tags => (
                <>
                    {defaultTo(tags, []).map(tag => {
                        return (
                            <Tag key={tag}>
                                {tag.toLowerCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Assessment',
            key: 'question',
            dataIndex: 'question',
            width: 140,
            render: (text, question) => <AssessmentCheckbox
                assessment={defaultTo(question.assessment, '')}
                disabled={disabled}
                onChange={value => {
                    if(onQuestionAssessmentChanged) {
                        onQuestionAssessmentChanged(question, value)
                    }
                }}
            />
        },
    ];

    const onCollapseClicked = () => {
        setCollapsed(!collapsed)
    }

    return <div className={styles.questionArea}>
        <Title id={group.name} level={4} onClick={onCollapseClicked} style={{ cursor: 'pointer' }} className={hashStyle ? hashStyle : null}>
            {collapsed && <CaretRightOutlined onClick={onCollapseClicked} style={{ paddingRight: 8 }} />}
            {!collapsed && <CaretDownOutlined onClick={onCollapseClicked} style={{ paddingRight: 8 }} />}
            {group.name} ({group.questions.length})
        </Title>
        {!collapsed && <div>
            <Card bodyStyle={{ padding: 0 }}>
                <Table columns={columns} dataSource={group.questions} pagination={false} />
            </Card>

            <Space className={styles.space} direction="vertical">

                <Text strong>Notes</Text>

                <TextArea
                    {...(disabled ? { readonly: "true" } : {})}
                    placeholder="Capture any key moments that happened during the interview."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    onChange={e => {
                        if (onNotesChanged) {
                            onNotesChanged(group, e.target.value)
                        }
                    }}
                    defaultValue={group.notes} />
            </Space>

            <Space className={styles.space} direction="vertical">
                <Text strong>Assessment</Text>

                <Radio.Group
                    key={group.assessment}
                    value={group.assessment}
                    buttonStyle="solid"
                    disabled={disabled}
                    onChange={e => {
                        if(onGroupAssessmentChanged) {
                            onGroupAssessmentChanged(group, e.target.value);
                        }
                    }}>
                    <Radio.Button value={GroupAssessment.NO_PROFICIENCY}>no proficiency</Radio.Button>
                    <Radio.Button value={GroupAssessment.LOW_SKILLED}>low skills</Radio.Button>
                    <Radio.Button value={GroupAssessment.SKILLED}>skilled</Radio.Button>
                    <Radio.Button value={GroupAssessment.HIGHLY_SKILLED}>highly skilled</Radio.Button>
                </Radio.Group>
            </Space>
        </div>}
    </div>
}

/**
 *
 * @param {Interview} interview
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param onNotesChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const GroupsSection = ({
                                  interview,
                                  onGroupAssessmentChanged,
                                  onQuestionAssessmentChanged,
                                  onNotesChanged,
                                  hashStyle
}) => {

    const getGroups = () => {
        if (interview && interview.structure && interview.structure.groups) {
            if (interview.status === Status.COMPLETED) {
                let groups = []
                interview.structure.groups.forEach(group => {
                    group.questions = group.questions.filter(question =>
                        defaultTo(question.assessment, '').length > 0)
                    if (group.questions.length > 0) {
                        groups.push(group)
                    }
                })
                return groups
            } else {
                return interview.structure.groups
            }
        } else {
            return []
        }
    }

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    return <>
        {getGroups().map(group =>
            <InterviewQuestionsCard
                group={group}
                disabled={isCompletedStatus()}
                onGroupAssessmentChanged={onGroupAssessmentChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                onNotesChanged={onNotesChanged}
                hashStyle={hashStyle}
            />)
        }
    </>
}
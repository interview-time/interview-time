import styles from "./interview-sections.module.css";
import React from 'react';
import { Button, Card, Col, Dropdown, Input, Menu, message, Modal, Radio, Row, Space, Table, Tag, Tooltip } from "antd";
import { DATE_FORMAT_DISPLAY, GroupAssessment, Status } from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { localeCompare, localeCompareArray } from "../../components/utils/comparators";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { routeInterviewDetails, routeTemplateDetails } from "../../components/utils/route";
import moment from "moment";
import { CollapseIcon, ExpandIcon } from "../../components/utils/icons";

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
        <Card style={marginTop12}>
            <IntroSection interview={interview} />
        </Card>
        <Card style={marginTop12}>
            <InterviewGroupsSection interview={interview} />
        </Card>
        <Card style={marginTop12}>
            <SummarySection interview={interview} />
        </Card>
    </div>;
}

/**
 *
 * @param {Template} template
 * @param onCloseClicked
 * @param onCreateInterviewClicked
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplatePreviewCard = ({ template, onCloseClicked, onCreateInterviewClicked }) => {
    const marginTop12 = { marginTop: 12 };
    return <div>
        <div className={styles.divSpaceBetween}>
            <Title level={4} style={{ marginBottom: 0 }}>Template</Title>
            <CloseOutlined onClick={onCloseClicked} style={{ cursor: 'pointer' }} />
        </div>
        <div className={styles.divSpaceBetween} style={marginTop12}>
            <Text>Use this template to create new interview and customize as you go.</Text>
            <Button type="primary" onClick={onCreateInterviewClicked}>Create interview</Button>
        </div>
        <Card style={marginTop12}>
            <IntroSection interview={template} />
        </Card>
        <Card style={marginTop12}>
            <TemplateGroupsSection template={template} />
        </Card>
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
            <Title level={4} style={{ marginBottom: 0 }}>Template</Title>
            <CloseOutlined onClick={onCloseClicked} style={{ cursor: 'pointer' }} />
        </div>
        <div className={styles.divSpaceBetween} style={marginTop12}>
            <Text>Use this template to create new interview and customize as you go.</Text>
        </div>
        <Card style={marginTop12}>
            <IntroSection interview={template} />
        </Card>
        <Card style={marginTop12}>
            <TemplateGroupsSection template={template} />
        </Card>
        <Card style={marginTop12}>
            <SummarySection interview={template} />
        </Card>
    </div>;
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
        <Menu>
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
                        <Link to={routeTemplateDetails(interview.templateId)} style={{ color: '#000000d9' }}>
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
 * @param {number} index
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
    index,
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
            width: 140,
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
    ];

    const onCollapseClicked = () => {
        setCollapsed(!collapsed)
    }

    return <div style={index === 0 ? { marginTop: 0 } : { marginTop: 64 }}>
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
                        if (onGroupAssessmentChanged) {
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
export const InterviewGroupsSection = ({
    interview,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    onNotesChanged,
    hashStyle
}) => {

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    return <>
        {interview.structure.groups.map((group, index) =>
            <InterviewQuestionsCard
                index={index}
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

/**
 *
 * @param {(Template)} template
 * @param onGroupAssessmentChanged
 * @param onQuestionAssessmentChanged
 * @param onNotesChanged
 * @param hashStyle
 * @returns {JSX.Element}
 * @constructor
 */
export const TemplateGroupsSection = ({
    template,
    onGroupAssessmentChanged,
    onQuestionAssessmentChanged,
    onNotesChanged,
    hashStyle
}) => {

    return <>
        {template.structure.groups.map((group, index) =>
            <InterviewQuestionsCard
                index={index}
                group={group}
                disabled={false}
                onGroupAssessmentChanged={onGroupAssessmentChanged}
                onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                onNotesChanged={onNotesChanged}
                hashStyle={hashStyle}
            />)
        }
    </>
}
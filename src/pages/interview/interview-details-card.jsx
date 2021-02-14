import styles from "./interview-details-card.module.css";
import React from 'react';
import { Alert, Anchor, Card, Col, Form, Input, Radio, Row, Space, Tag } from "antd";
import InterviewQuestionsCard from "./interview-questions-card";
import {
    DATE_FORMAT_DISPLAY,
    getDecisionColor,
    getDecisionText,
    getStatusText,
    InterviewAssessment,
    Status
} from "../../components/utils/constants";
import { defaultTo } from "lodash/util";
import moment from "moment";
import Text from "antd/lib/typography/Text";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};

const InterviewDetailsCard = ({ interview, disabled, paddingTop, onInterviewChange }) => {

    const onAssessmentChanged = e => {
        interview.decision = e.target.value
        onTriggerChangeEvent()
    };

    const onNoteChanges = e => {
        interview.notes = e.target.value
        onTriggerChangeEvent()
    };

    const onTriggerChangeEvent = () => {
        if (onInterviewChange !== undefined) {
            onInterviewChange()
        }
    }

    const getHeader = () => {
        if (interview && interview.structure && interview.structure.header) {
            return interview.structure.header
        } else {
            return "Intro text is empty."
        }
    }

    const getFooter = () => {
        if (interview && interview.structure && interview.structure.footer) {
            return interview.structure.footer
        } else {
            return "Summary text is empty."
        }
    }

    const getGroups = () => {
        if (interview && interview.structure && interview.structure.groups) {
            if (interview.status === Status.COMPLETED) {
                let groups = []
                interview.structure.groups.forEach(group => {
                    group.questions = group.questions.filter(question => {
                        return defaultTo(question.assessment, '').length > 0
                    })
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

    return <Row key={interview.interviewId} gutter={16}>
        <Col span={20} style={{ paddingTop: paddingTop ? paddingTop : 0 }}>

            {interview.interviewId && <div>
                {interview.status !== Status.COMPLETED && <Alert
                    style={{ marginBottom: 24 }}
                    message="Make yourself familiar with the interview experience to be comfortable during the interview. When you are ready, click on the 'Complete' button to finish the interview."
                    type="info"
                    showIcon
                    banner
                    closable
                />}

                <Row style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Space direction='vertical'>
                            <div><Text strong>Status:</Text> {getStatusText(interview.status)}</div>
                            <div><Text strong>Position:</Text> {interview.position}</div>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space direction='vertical'>
                            <div>
                                <Text
                                    strong>Date:</Text> {moment(interview.interviewDateTime).format(DATE_FORMAT_DISPLAY)}
                            </div>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space direction='vertical'>
                            {interview.decision &&
                            <div><Text strong>Decision:</Text> <Tag color={getDecisionColor(interview.decision)}
                                                                    key={interview.decision}>
                                {getDecisionText(interview.decision)}
                            </Tag></div>}
                        </Space>
                    </Col>
                </Row>
            </div>}

            {!interview.interviewId && <Alert
                style={{ marginBottom: 24 }}
                message="This is how your interview will look like. Make yourself familiar with the interview experience to be comfortable during the interview."
                type="info"
                showIcon
                banner
            />}

            <Card
                id="intro"
                title="Intro">
                <Form.Item>
                    <div className={styles.multiLineText}>{getHeader()}</div>
                </Form.Item>
            </Card>

            {getGroups().map(group => {
                return <InterviewQuestionsCard group={group} disabled={disabled}
                                               onInterviewChange={onInterviewChange} />
            })}

            <Card
                id="summary"
                title="Summary"
                bodyStyle={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                style={{ marginTop: 24 }}>
                <Form
                    {...layout}
                    initialValues={{ remember: true }}
                    style={{ marginTop: 24 }}>

                    <Form.Item style={{ paddingLeft: 24, paddingRight: 24 }}>
                        <div className={styles.multiLineText}>{getFooter()}</div>
                    </Form.Item>

                    <Form.Item label="Notes">
                        <TextArea
                            {...(disabled ? { readonly: "true" } : {})}
                            placeholder="Capture any key moments that happened during the interview."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            onChange={onNoteChanges}
                            defaultValue={interview.notes} />
                    </Form.Item>

                    <Form.Item label="Decision">
                        <Radio.Group
                            {...(disabled ? { value: interview.decision } : { defaultValue: interview.decision })}
                            buttonStyle="solid"
                            onChange={onAssessmentChanged}>
                            <Radio.Button value={InterviewAssessment.STRONG_NO}>strong no</Radio.Button>
                            <Radio.Button value={InterviewAssessment.NO}>no</Radio.Button>
                            <Radio.Button value={InterviewAssessment.YES}>yes</Radio.Button>
                            <Radio.Button value={InterviewAssessment.STRONG_YES}>strong yes</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
        <Col span={4}>
            <div className={styles.sticky} style={{ paddingTop: paddingTop ? paddingTop : 0 }}>
                <Card title="Structure">
                    <Anchor affix={false}>
                        <Anchor.Link href="#intro" title="Intro" />
                        {getGroups().map(group => {
                            return <Anchor.Link href={`#${group.name}`} title={group.name} />
                        })}
                        <Anchor.Link href="#summary" title="Summary" />
                    </Anchor>
                </Card>
            </div>
        </Col>
    </Row>
}

export default InterviewDetailsCard;
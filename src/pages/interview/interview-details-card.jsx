import styles from "./interview-details-card.module.css";
import React from 'react';
import { Alert, Anchor, Col, Divider, Input, Radio, Row, Space, Tag } from "antd";
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
import Title from "antd/lib/typography/Title";

const { TextArea } = Input;

const PADDING_TOP_ANCHOR = 72 + 24 /* header height + padding */
const ANCHOR_WIDTH = 148

const InterviewDetailsCard = ({
                                  interview,
                                  disabled,
                                  onInterviewChange,
                                  hideAnchor
                              }) => {

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

    return <div key={interview.interviewId} className={styles.rootContainer}>

        {!hideAnchor && <div className={styles.sticky} style={{ paddingTop: PADDING_TOP_ANCHOR }}>
            <Anchor affix={false}>
                <Anchor.Link href="#intro" title="Intro" />
                {getGroups().map(group => {
                    return <Anchor.Link href={`#${group.name}`} title={group.name} />
                })}
                <Anchor.Link href="#summary" title="Summary" />
            </Anchor>
        </div>}

        <div style={{ paddingTop: hideAnchor ? 0 : PADDING_TOP_ANCHOR, paddingRight: hideAnchor ? 0 : ANCHOR_WIDTH }}>

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
                    {interview.candidateNotes && <div style={{ marginTop: 8 }}>
                        <Text strong>Notes:</Text> {interview.candidateNotes}
                    </div>}
                </Row>
                <Divider />
            </div>}

            {!interview.interviewId && <Alert
                style={{ marginBottom: 24 }}
                message="This is how your interview will look like. Make yourself familiar with the interview experience to be comfortable during the interview."
                type="info"
                showIcon
                banner
            />}

            <Title id="intro" level={4} className={styles.header}>Intro</Title>
            <div className={styles.multiLineText}>{getHeader()}</div>

            {getGroups().map(group =>
                <InterviewQuestionsCard group={group} disabled={disabled} onInterviewChange={onInterviewChange} />)
            }

            <Title id="summary" level={4} className={styles.header}>Summary</Title>

            <div className={styles.multiLineText}>{getFooter()}</div>

            <Space className={styles.space} direction="vertical">

                <Text strong>Notes</Text>

                <TextArea
                    {...(disabled ? { readonly: "true" } : {})}
                    placeholder="Capture any key moments that happened during the interview."
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    onChange={onNoteChanges}
                    defaultValue={interview.notes} />
            </Space>

            <Space className={styles.space} style={{ paddingBottom: 64 }} direction="vertical">
                <Text strong>Decision</Text>

                <Radio.Group
                    {...(disabled ? { value: interview.decision } : { defaultValue: interview.decision })}
                    buttonStyle="solid"
                    onChange={onAssessmentChanged}>
                    <Radio.Button value={InterviewAssessment.STRONG_NO}>strong no</Radio.Button>
                    <Radio.Button value={InterviewAssessment.NO}>no</Radio.Button>
                    <Radio.Button value={InterviewAssessment.YES}>yes</Radio.Button>
                    <Radio.Button value={InterviewAssessment.STRONG_YES}>strong yes</Radio.Button>
                </Radio.Group>
            </Space>
        </div>
    </div>
}

export default InterviewDetailsCard;
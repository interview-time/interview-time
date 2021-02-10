import styles from "./interview-details-card.module.css";
import React from 'react';
import { Anchor, Card, Col, Form, Input, Radio, Row } from "antd";
import InterviewQuestionsCard from "./interview-questions-card";
import Typography from "antd/es/typography";
import { InterviewAssessment, Status } from "../utils/constants";
import { defaultTo } from "lodash/util";

const { TextArea } = Input;
const { Text } = Typography;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};

const InterviewDetailsCard = ({ interview, disabled, paddingTop }) => {

    const onAssessmentChanged = e => {
        interview.decision = e.target.value
    };

    const onNoteChanges = e => {
        interview.notes = e.target.value
    };

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
            <Card
                id="intro"
                title="Intro">
                <Form.Item>
                    <Text>{getHeader()}</Text>
                </Form.Item>
            </Card>

            {getGroups().map(group => {
                return <InterviewQuestionsCard group={group} disabled={disabled} />
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
                        <Text>{getFooter()}</Text>
                    </Form.Item>

                    <Form.Item label="Notes">
                        <TextArea
                            {...(disabled ? { readonly: "true" } : {})}
                            placeholder="Capture any key moments that happened during the interview."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            onChange={onNoteChanges}
                            defaultValue={interview.notes} />
                    </Form.Item>

                    <Form.Item label="Assessment">
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
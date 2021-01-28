import React, { useState } from 'react';
import { Affix, Anchor, Card, Col, Form, Input, Radio, Row } from "antd";
import InterviewQuestionsCard from "./interview-questions-card";
import Typography from "antd/es/typography";
import { InterviewAssessment } from "../utils/constants";

const { TextArea } = Input;
const { Text } = Typography;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
};

const InterviewDetailsCard = ({interview, header, disabled}) => {

    const [offset, setOffset] = useState(0);

    React.useEffect(() => {
        if (header) {
            setOffset(header.current.getBoundingClientRect().height + 26)
        }
    }, [header]);

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
            return "Overall text is empty."
        }
    }

    const getGroups = () => {
        if (interview && interview.structure && interview.structure.groups) {
            return interview.structure.groups
        } else {
            return []
        }
    }

    return <Row gutter={16} key={interview.interviewId}>
        <Col span={20}>
            <Card
                id="intro"
                title="Intro"
                bordered={false}>
                <Form.Item>
                    <Text>{getHeader()}</Text>
                </Form.Item>
            </Card>

            {getGroups().map(group => {
                return <InterviewQuestionsCard group={group} disabled={disabled} />
            })}

            <Card
                id="overall"
                title="Overall"
                bordered={false}
                style={{ marginTop: 24 }}>
                <Form
                    {...layout}
                    initialValues={{ remember: true }}
                    style={{ marginTop: 24 }}>

                    <Form.Item>
                        <Text>{getFooter()}</Text>
                    </Form.Item>

                    <Form.Item label="Notes">
                        <TextArea
                            placeholder="Capture any key moments that happened during the interview."
                            disabled={disabled}
                            onChange={onNoteChanges}
                            defaultValue={interview.notes} />
                    </Form.Item>

                    <Form.Item label="Assessment">
                        <Radio.Group defaultValue={interview.decision} disabled={disabled}
                                     onChange={onAssessmentChanged}>
                            <Radio.Button value={InterviewAssessment.STRONG_NO}>strong no</Radio.Button>
                            <Radio.Button value={InterviewAssessment.NO}>no</Radio.Button>
                            <Radio.Button value={InterviewAssessment.YES}>yes</Radio.Button>
                            <Radio.Button value={InterviewAssessment.STRONG_YES}>strong  yes</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Card>
        </Col>

        <Col span={4}>

            <Affix offsetTop={offset}>
                <div>
                    <Card title="Structure" bordered={false}>
                        <Anchor affix={false}>
                            <Anchor.Link href="#intro" title="Intro" />
                            {getGroups().map(group => {
                                return <Anchor.Link href={`#${group.name}`} title={group.name} />
                            })}
                            <Anchor.Link href="#overall" title="Overall" />
                        </Anchor>
                    </Card>
                </div>
            </Affix>

        </Col>
    </Row>
}

export default InterviewDetailsCard;
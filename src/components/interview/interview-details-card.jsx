import React from 'react';
import {Anchor, Card, Col, Form, Input, Radio, Row, Statistic} from "antd";
import InterviewQuestionsCard from "./interview-questions-card";
import Typography from "antd/es/typography";

const {TextArea} = Input;
const {Text} = Typography;
const {Countdown} = Statistic;

const INTERVIEW_TIME = Date.now() + 1000 * 60 * 60;

const ASSESSMENT_YES = 'yes';
const ASSESSMENT_NO = 'no';
const ASSESSMENT_STRONG_YES = 'strong yes';
const ASSESSMENT_STRONG_NO = 'strong no';

const InterviewDetailsCard = () => {
    return <Row gutter={16}>
        <Col span={20}>
            <Card
                title="Intro"
                bordered={false}>
                <Form.Item>
                    <Text>Take 10 minutes to introduce yourself and make the candidate comfortable.</Text>
                </Form.Item>
                <Form.Item label="Notes">
                    <TextArea placeholder="Capture any key moments that happened during the interview." />
                </Form.Item>
            </Card>

            <InterviewQuestionsCard />
            <InterviewQuestionsCard />

            <Card
                title="Overall"
                bordered={false}
                style={{marginTop: 24}}>
                <Form
                    labelCol={{span: 3}}
                    wrapperCol={{span: 20}}
                    initialValues={{remember: true}}
                    style={{marginTop: 24}}>

                    <Form.Item>
                        <Text>Should the candidate proceed to the next stage?</Text>
                    </Form.Item>

                    <Form.Item label="Notes">
                        <TextArea
                            placeholder="Capture any key moments that happened during the interview." />
                    </Form.Item>

                    <Form.Item label="Assessment">
                        <Radio.Group defaultValue="{a}">
                            <Radio.Button value="a">{ASSESSMENT_STRONG_NO}</Radio.Button>
                            <Radio.Button value="b">{ASSESSMENT_NO}</Radio.Button>
                            <Radio.Button value="c">{ASSESSMENT_YES}</Radio.Button>
                            <Radio.Button value="d">{ASSESSMENT_STRONG_YES}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Card>
        </Col>

        <Col span={4}>

            <Card title="Structure" bordered={false}>
                <Anchor>
                    <Anchor.Link href="#test1" title="Intro" />
                    <Anchor.Link href="#components-anchor-demo-basic2" title="Core Android" />
                    <Anchor.Link href="#components-anchor-demo-basic3" title="Android Architecture" />
                    <Anchor.Link href="#components-anchor-demo-basic4" title="Problem Solving" />
                    <Anchor.Link href="#components-anchor-demo-basic5" title="Overall" />
                </Anchor>
            </Card>

            <Card
                bordered={false}
                style={{marginTop: 12}}>
                <Countdown title="Time" value={INTERVIEW_TIME} format="HH:mm:ss" />
            </Card>
        </Col>
    </Row>
}

export default InterviewDetailsCard;
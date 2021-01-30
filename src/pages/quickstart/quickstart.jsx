import styles from "./quickstart.module.css";
import Layout from "../../components/layout/layout";
import { Button, Card, Col, Row } from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";
import { useHistory } from "react-router-dom";

const Quickstart = () => {

    const history = useHistory();

    const onQuestionBankClicked = () => {
        history.push("/question-bank")
    }

    const onGuidesClicked = () => {
        history.push("/guides")
    }

    const onInterviewsClicked = () => {
        history.push("/interviews")
    }

    return (
        <Layout pageHeader={<></>}>

            <Row justify="center">
                <Col span={12}>
                    <div className={styles.pageHeader}><Title level={2}>Your quick start guide</Title></div>

                    <Card className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.growLeft}>
                                <Title level={5}>Question Bank</Title>
                                <p>Start with a bank of questions from our template or add your own, to make sure you’re
                                    asking a consistent set of questions.</p>
                                <Button type="primary" onClick={onQuestionBankClicked}>Open Question Bank</Button>
                            </div>
                            <img alt="Questions" src={process.env.PUBLIC_URL + '/quickstart/questions.png'}
                                 className={styles.image} />
                        </div>
                    </Card>

                    <Card className={styles.card}>
                        <div className={styles.content}>
                            <img alt="Guides" src={process.env.PUBLIC_URL + '/quickstart/guides.png'}
                                 className={styles.image} />
                            <div className={styles.growRight}>
                                <Title level={5}>Guides</Title>
                                <p>To keep the interview process structured, create a guide for the desired role.</p>
                                <p>Interview guide system helps you to focus on the interview, not preparation.</p>
                                <Button type="primary" onClick={onGuidesClicked}>Open Guides</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.growLeft}>
                                <Title level={5}>Interviews</Title>
                                <p>Select a guide which will be used during the interview.</p>
                                <p>The interview scorecard mechanism helps to reduce unconscious biases and make a
                                    data-driven hiring decision.</p>
                                <Button type="primary" onClick={onInterviewsClicked}>Open Interviews</Button>
                            </div>
                            <img alt="Interviews" src={process.env.PUBLIC_URL + '/quickstart/interviews.png'}
                                 className={styles.image} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}
export default Quickstart;
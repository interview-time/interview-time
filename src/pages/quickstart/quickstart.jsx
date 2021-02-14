import styles from "./quickstart.module.css";
import Layout from "../../components/layout/layout";
import { Button, Card, Col, Row } from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";
import { useHistory } from "react-router-dom";
import { routeInterviews, routeQuestionBank, routeTemplates } from "../../components/utils/route";

const Quickstart = () => {

    const history = useHistory();

    const onQuestionBankClicked = () => {
        history.push(routeQuestionBank())
    }

    const onGuidesClicked = () => {
        history.push(routeTemplates())
    }

    const onInterviewsClicked = () => {
        history.push(routeInterviews())
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
                            <img alt="Templates" src={process.env.PUBLIC_URL + '/quickstart/templates.png'}
                                 className={styles.image} />
                            <div className={styles.growRight}>
                                <Title level={5}>Templates</Title>
                                <p>To keep the interview process structured, create a template for the desired role.</p>
                                <p>Interview template system helps you to focus on the interview, not preparation.</p>
                                <Button type="primary" onClick={onGuidesClicked}>Open Templates</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className={styles.card}>
                        <div className={styles.content}>
                            <div className={styles.growLeft}>
                                <Title level={5}>Interviews</Title>
                                <p>Select a template which will be used during the interview.</p>
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
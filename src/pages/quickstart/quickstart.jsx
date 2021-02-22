import styles from "./quickstart.module.css";
import { Button, Card, Progress, Space } from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";
import { useHistory } from "react-router-dom";
import { routeInterviewAdd, routeQuestionBank, routeTemplateAdd, } from "../../components/utils/route";
import { shallowEqual, useSelector } from "react-redux";
import Text from "antd/lib/typography/Text";
import { updateQuickstartDisplayed } from "../../components/utils/storage";

const Quickstart = ({ onButtonClicked }) => {

    const history = useHistory();

    const { guides } = useSelector(state => ({
        guides: state.guides.guides
    }), shallowEqual);

    const { questions } = useSelector(state => ({
        questions: state.questionBank.questions
    }), shallowEqual);

    const { interviews } = useSelector(state => ({
        interviews: state.interviews.interviews,
    }), shallowEqual);

    const tasksCount = 3

    React.useEffect(() => {
        updateQuickstartDisplayed()
        // eslint-disable-next-line
    }, [])

    const onQuestionBankClicked = () => {
        onButtonClicked()
        history.push(routeQuestionBank())
    }

    const onGuidesClicked = () => {
        onButtonClicked()
        history.push(routeTemplateAdd())
    }

    const onInterviewsClicked = () => {
        onButtonClicked()
        history.push(routeInterviewAdd())
    }

    const getTaskProgress = () => (tasksCount - getRemainingTasksCount()) * (100 / tasksCount)

    const getRemainingTasksCount = () => {
        let remainingTasks = 0;
        if (guides.length === 0) {
            remainingTasks++;
        }
        if (questions.length === 0) {
            remainingTasks++;
        }
        if (interviews.length === 0) {
            remainingTasks++;
        }
        return remainingTasks
    }

    return (
        <div>
            <div style={{display: "flex", marginBottom: 24}}>
                <Progress
                    type="circle"
                    width={64}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                    format={() => getRemainingTasksCount()}
                    strokeWidth={12}
                    percent={getTaskProgress()}
                />
                <Space direction="vertical" size={0} style={{marginLeft: 12}}>
                    <Title level={3} style={{marginBottom: 0}}>Quick Start</Title>
                    <Text>Take full advantage of Interviewer's powerful features.</Text>
                </Space>
            </div>
            {questions.length === 0 && <Card className={styles.card}>
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
            </Card>}

            {guides.length === 0 && <Card className={styles.card}>
                <div className={styles.content}>
                    <img alt="Templates" src={process.env.PUBLIC_URL + '/quickstart/templates.png'}
                         className={styles.image} />
                    <div className={styles.growRight}>
                        <Title level={5}>Templates</Title>
                        <p>To keep the interview process structured, create a template for the desired role.</p>
                        <p>Interview template system helps you to focus on the interview, not preparation.</p>
                        <Button type="primary" onClick={onGuidesClicked}>Add Template</Button>
                    </div>
                </div>
            </Card>}

            {interviews.length === 0 && <Card className={styles.card}>
                <div className={styles.content}>
                    <div className={styles.growLeft}>
                        <Title level={5}>Interviews</Title>
                        <p>Select a template which will be used during the interview.</p>
                        <p>The interview scorecard mechanism helps to reduce unconscious biases and make a
                            data-driven hiring decision.</p>
                        <Button type="primary" onClick={onInterviewsClicked}>Add Interviews</Button>
                    </div>
                    <img alt="Interviews" src={process.env.PUBLIC_URL + '/quickstart/interviews.png'}
                         className={styles.image} />
                </div>
            </Card>}
        </div>
    )
}
export default Quickstart;
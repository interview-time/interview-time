import styles from "./quickstart.module.css";
import { Button, Card, Progress, Space } from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";
import { useHistory } from "react-router-dom";
import { routeInterviewAdd, routeQuestionBank, routeTemplateAdd, } from "../../components/utils/route";
import Text from "antd/lib/typography/Text";
import {
    isAddInterviewClicked,
    isAddTemplateClicked,
    isQuestionBankClicked,
    updateAddInterviewClicked,
    updateAddTemplateClicked,
    updateQuestionBankClicked,
    updateQuickstartDisplayed
} from "../../components/utils/storage";

const Quickstart = ({ onButtonClicked }) => {

    const history = useHistory();

    const tasksCount = 3

    React.useEffect(() => {
        updateQuickstartDisplayed()
        // eslint-disable-next-line
    }, [])

    const onQuestionBankClicked = () => {
        updateQuestionBankClicked()
        onButtonClicked()
        history.push(routeQuestionBank())
    }

    const onTemplateClicked = () => {
        updateAddTemplateClicked()
        onButtonClicked()
        history.push(routeTemplateAdd())
    }

    const onInterviewsClicked = () => {
        updateAddInterviewClicked()
        onButtonClicked()
        history.push(routeInterviewAdd())
    }

    const getTaskProgress = () => (tasksCount - getRemainingTasksCount()) * (100 / tasksCount)

    const getRemainingTasksCount = () => {
        let remainingTasks = 0;
        if (!isQuestionBankClicked()) {
            remainingTasks++;
        }
        if (!isAddInterviewClicked()) {
            remainingTasks++;
        }
        if (!isAddTemplateClicked()) {
            remainingTasks++;
        }
        return remainingTasks
    }

    return (
        <div>
            <div style={{ display: "flex", marginBottom: 24 }}>
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
                <Space direction="vertical" size={0} style={{ marginLeft: 12 }}>
                    <Title level={3} style={{ marginBottom: 0 }}>Quick Start</Title>
                    <Text>Take full advantage of Interviewer's powerful features.</Text>
                </Space>
            </div>
            {!isQuestionBankClicked() && <Card className={styles.card}>
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

            {!isAddTemplateClicked() && <Card className={styles.card}>
                <div className={styles.content}>
                    <img alt="Templates" src={process.env.PUBLIC_URL + '/quickstart/templates.png'}
                         className={styles.image} />
                    <div className={styles.growRight}>
                        <Title level={5}>Templates</Title>
                        <p>To keep the interview process structured, create a template for the desired role.</p>
                        <p>Interview template system helps you to focus on the interview, not preparation.</p>
                        <Button type="primary" onClick={onTemplateClicked}>Add Template</Button>
                    </div>
                </div>
            </Card>}

            {!isAddInterviewClicked() && <Card className={styles.card}>
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
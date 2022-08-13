import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Challenge } from "../../store/models";
import { Button, Col, Row, Form, Input, Typography, message } from "antd";
import File from "../../components/file/file";
import Card from "../../components/card/card";
import logo from "../../assets/logo-horiz.png";
import styles from "./challenge-details.module.css";
import { RootState } from "../../store/state-models";
import { loadChallenge, submitSolution } from "../../store/challenge/actions";
import { ChallengeStatus } from "../../utils/constants";

const { Paragraph, Text } = Typography;

type Props = {
    challenge: Challenge;
    loadChallenge: any;
    submitSolution: any;
};

const ChallengeDetails = ({ challenge, loadChallenge, submitSolution }: Props) => {
    const { token } = useParams<Record<string, string | undefined>>();
    const [solutionSubmitted, setSolutionSubmitted] = useState(false);

    useEffect(() => {
        if (token) {
            loadChallenge(token);
        }
    }, [token, loadChallenge]);

    useEffect(() => {
        if (solutionSubmitted && challenge && challenge.status === ChallengeStatus.SolutionSubmitted) {
            message.success("Your solution was submitted successfully!");
        }
    }, [solutionSubmitted, challenge]);

    const onSubmitClicked = (values: any) => {
        const gitHubRepo = values.githubrepo;

        submitSolution(token, gitHubRepo);
        setSolutionSubmitted(true);
    };

    return (
        <div className={styles.rootContainer}>
            <div className={styles.header}>
                <a href='https://interviewtime.io'>
                    <img alt='InterviewTime' src={logo} className={styles.logo} />
                </a>
            </div>

            {challenge && (
                <>
                    <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                        {challenge.status === ChallengeStatus.SolutionSubmitted && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card title='🎉 Your solution was submitted successfully!' />
                                </Col>
                            </Row>
                        )}

                        <Row gutter={24} className={styles.section}>
                            <Col span={24}>
                                <Card title='Challenge'>
                                    <Paragraph className={styles.notesTextArea}>{challenge.description}</Paragraph>
                                </Card>
                            </Col>
                        </Row>
                        {challenge.challengeDownloadUrl && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card title='Supporting files'>
                                        <File
                                            filename='News feed application (Kotlin)'
                                            url={`${process.env.REACT_APP_API_URL}${challenge.challengeDownloadUrl}`}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        )}
                        {challenge.status === ChallengeStatus.SentToCandidate && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card title='Submit Solution'>
                                        <Form
                                            style={{ marginTop: 24 }}
                                            name='basic'
                                            layout='vertical'
                                            onFinish={onSubmitClicked}
                                        >
                                            <Form.Item
                                                name='githubrepo'
                                                label={<Text strong={true}>GitHub repo</Text>}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please paste in GitHub repo with your solution",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder='GitHub repo' />
                                            </Form.Item>
                                            <div className={styles.divRight}>
                                                <Button type='primary' htmlType='submit'>
                                                    Submit
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        challenge: state.challenge.details,
        loading: state.challenge.loading,
    };
};
export default connect(mapStateToProps, { loadChallenge, submitSolution })(ChallengeDetails);

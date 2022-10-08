import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { CandidateChallenge } from "../../../store/models";
import { Button, Col, Row, Form, Input, Typography, message, Divider } from "antd";
import Card from "../../../components/card/card";
import styles from "./take-home-challenge.module.css";
import { RootState } from "../../../store/state-models";
import { loadChallenge, submitSolution } from "../../../store/challenge/actions";
import { ChallengeStatus } from "../../../utils/constants";
import { Logo } from "../../../components/logo/logo";
import GitHubLink from "../../../components/github-link/github-link";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { INTERVIEW_TAKE_HOME_TASK } from "../../../utils/interview";

const { Text } = Typography;

type Props = {
    challenge: CandidateChallenge;
    loadChallenge: any;
    submitSolution: any;
    loading: boolean;
};

const ChallengeDetails = ({ challenge, loadChallenge, submitSolution, loading }: Props) => {
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
                <Logo />
            </div>

            {challenge && (
                <>
                    <Col md={{ span: 20, offset: 2 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 10, offset: 7 }}>
                        {challenge.status === ChallengeStatus.SolutionSubmitted && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card featured={true}>
                                        <p className={styles.title}>
                                            🎉 Thanks for submitting your solution, {challenge.candidateName}!
                                        </p>
                                        <p>
                                            One of the interviewers will review your solution and will let you know how
                                            did you go.
                                        </p>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        {challenge.status !== ChallengeStatus.SolutionSubmitted && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card>
                                        <p className={styles.title}>👋 Hi {challenge.candidateName},</p>
                                        <p>
                                            As a part of your interview process, you've been asked to complete the
                                            take-home assignment.
                                        </p>
                                        <p>
                                            Please complete the assignment described below.
                                        </p>
                                        <p>
                                            Once completed create a public repo in GitHub and submit the link at the
                                            bottom of this page.
                                        </p>
                                        <p>Good Luck!</p>
                                    </Card>
                                </Col>
                            </Row>
                        )}

                        <Row gutter={24} className={styles.section}>
                            <Col span={24}>
                                <Card title={INTERVIEW_TAKE_HOME_TASK}>
                                    <p>{challenge.description}</p>

                                    <Divider />

                                    <div>
                                        {challenge.gitHubUrl && <GitHubLink url={challenge.gitHubUrl} />}

                                        {challenge.downloadFileUrl && (
                                            <Button
                                                className={styles.buttonSecondary}
                                                href={`${process.env.REACT_APP_API_URL}${challenge.downloadFileUrl}`}
                                            >
                                                <CloudDownloadOutlined className={styles.icon} />
                                                Download Challenge
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        {challenge.status === ChallengeStatus.SentToCandidate && (
                            <Row gutter={24} className={styles.section}>
                                <Col span={24}>
                                    <Card
                                        className={styles.submitSolution}
                                        title='Submit Solution'
                                        subtitle='Please submit your solution here when you finish with the assignment'
                                        featured={true}
                                    >
                                        <Form
                                            style={{ marginTop: 24 }}
                                            name='basic'
                                            layout='vertical'
                                            onFinish={onSubmitClicked}
                                        >
                                            <Form.Item
                                                name='githubrepo'
                                                label={<Text strong={true}>GitHub</Text>}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please paste in GitHub repo with your solution",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder='Public GitHub repo with your solution' />
                                            </Form.Item>
                                            <div className={styles.divRight}>
                                                <Button type='primary' htmlType='submit' loading={loading}>
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

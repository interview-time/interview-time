import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { CandidateChallenge } from "../../../store/models";
import { Button, Col, Row, Form, Input, Typography, message } from "antd";
import File from "../../../components/file/file";
import Card from "../../../components/card/card";
import styles from "./take-home-challenge.module.css";
import { RootState } from "../../../store/state-models";
import { loadChallenge, submitSolution } from "../../../store/challenge/actions";
import { ChallengeStatus } from "../../../utils/constants";

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
                <a href='https://interviewtime.io' className={styles.logoHolder}>
                    <img alt='InterviewTime' src={process.env.PUBLIC_URL + "/logo192.png"} className={styles.logo} />
                    <span className={styles.logoText}>InterviewTime</span>
                </a>
            </div>

            {challenge && (
                <>
                    <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
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
                                            take-home challenge.
                                        </p>
                                        <p>
                                            {challenge.challengeDownloadUrl
                                                ? "Please complete the challenge described below using the template provided in the Supporting Files section."
                                                : "Please complete the challenge described below."}
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
                                <Card title='Challenge'>
                                    <p>{challenge.description}</p>
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
                                    <Card
                                        className={styles.submitSolution}
                                        title='Submit Solution'
                                        subtitle='Please submit your solution here when you finish with the challenge'
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

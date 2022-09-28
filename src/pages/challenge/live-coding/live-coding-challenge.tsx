import { Button, Col, Divider, Result } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import Card from "../../../components/card/card";
import Title from "antd/lib/typography/Title";
import styles from "./live-coding-challenge.module.css";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store/state-models";
import { loadChallenge } from "../../../store/challenge/actions";
import { CandidateChallenge } from "../../../store/models";
import { Logo } from "../../../components/logo/logo";
import GitHubLink from "../../../components/github-link/github-link";
import { CloudDownloadOutlined } from "@ant-design/icons";

type Props = {
    challenge: CandidateChallenge;
    loadChallenge: any;
    loading: boolean;
    isExpired: boolean;
};

const LiveCodingChallenge = ({ challenge, loadChallenge, loading, isExpired }: Props) => {
    const { token } = useParams<Record<string, string | undefined>>();

    useEffect(() => {
        if (token) {
            loadChallenge(token);
        }
    }, [token, loadChallenge]);

    return (
        <div className={styles.rootContainer}>
            <div className={styles.header}>
                <Logo />
            </div>

            {isExpired && <Result status='404' title='Coding challenge not found or it has expired' />}

            {challenge && !isExpired && (
                <Col md={{ span: 20, offset: 2 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 10, offset: 7 }}>
                    <Card className={styles.card}>
                        <Title level={4} style={{ marginTop: 12 }}>
                            Code Challenge
                        </Title>

                        <div style={{ marginTop: 12 }}>{challenge.description}</div>

                        <Divider />

                        <div className={styles.buttonContainer}>
                            {challenge.gitHubUrl && <GitHubLink url={challenge.gitHubUrl} primary={true} />}

                            {challenge.downloadFileUrl && (
                                <Button
                                    className={styles.button}
                                    type='primary'
                                    href={`${process.env.REACT_APP_API_URL}${challenge.downloadFileUrl}`}
                                >
                                    <CloudDownloadOutlined className={styles.icon} />
                                    Download Challenge
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>
            )}
        </div>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        challenge: state.challenge.details,
        loading: state.challenge.loading,
        isExpired: state.challenge.isExpired,
    };
};
export default connect(mapStateToProps, { loadChallenge })(LiveCodingChallenge);

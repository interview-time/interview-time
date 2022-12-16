import { Button, Col, Divider, Result } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import Card from "../../../components/card/card";
import { Typography } from "antd";
import styles from "./live-coding-challenge.module.css";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store/state-models";
import { loadChallenge } from "../../../store/challenge/actions";
import { CandidateChallenge } from "../../../store/models";
import { Logo } from "../../../components/logo/logo";
import GitHubLink from "../../../components/github-link/github-link";
import { CloudDownloadOutlined } from "@ant-design/icons";
import ProgrammerImage from "../../../assets/illustrations/undraw_programmer_re_owql.svg";
import { isEmpty } from "lodash";

const { Title } = Typography;

type Props = {
    challenge?: CandidateChallenge;
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
                        <img src={ProgrammerImage} width={156} alt='Programmer' />
                        <div className={styles.textContainer}>
                            <Title level={4} style={{ marginTop: 12 }}>
                                Code Challenge
                            </Title>

                            {isEmpty(challenge.description) ? (
                                <div style={{ marginTop: 12 }}>
                                    As a part of your interview process, you've been asked to complete the code
                                    challenge.
                                </div>
                            ) : (
                                <div style={{ marginTop: 12 }}>{challenge.description}</div>
                            )}

                            <Divider />

                            <div className={styles.buttonContainer}>
                                {challenge.gitHubUrl && (
                                    <GitHubLink url={challenge.gitHubUrl} className={styles.button} primary={true} />
                                )}

                                {challenge.downloadFileUrl && (
                                    <Button
                                        type='primary'
                                        href={`${process.env.REACT_APP_API_URL}${challenge.downloadFileUrl}`}
                                    >
                                        <CloudDownloadOutlined className={styles.icon} />
                                        Download Challenge
                                    </Button>
                                )}
                            </div>
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

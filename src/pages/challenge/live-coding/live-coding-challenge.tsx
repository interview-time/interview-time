import { Button, Col, Divider, Row } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Card from "../../../components/card/card";
import Title from "antd/lib/typography/Title";
import { getApiUrl } from "../../../utils/route";
import styles from "./live-coding-challenge.module.css";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store/state-models";
import { loadChallenge } from "../../../store/challenge/actions";
import { CandidateChallenge } from "../../../store/models";

type Props = {
    challenge: CandidateChallenge;
    loadChallenge: any;
    loading: boolean;
};

const LiveCodingChallenge = ({ challenge, loadChallenge, loading }: Props) => {
    const { token } = useParams<Record<string, string | undefined>>();
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (token) {
            loadChallenge(token);
        }
    }, [token, loadChallenge]);

    return (
        <div className={styles.rootContainer}>
            <div className={styles.header}>
                <a href='https://interviewtime.io' className={styles.logoHolder}>
                    <img alt='InterviewTime' src={process.env.PUBLIC_URL + "/logo192.png"} className={styles.logo} />
                    <span className={styles.logoText}>InterviewTime</span>
                </a>
            </div>

            {challenge && (
                <Col span={24} xxl={{ span: 8, offset: 8 }} xl={{ span: 8, offset: 8 }} lg={{ span: 12, offset: 6 }}>
                    <Card style={{ marginTop: 32 }}>
                        <Title level={4} style={{ marginTop: 12 }}>
                            Code Challenge
                        </Title>

                        <div style={{ marginTop: 12 }}>{challenge.description}</div>
                        <Divider />
                        <div className={styles.buttonContainer}>
                            <Button
                                type='primary'
                                disabled={isExpired}
                                onClick={() => setIsExpired(true)}
                                href={`${getApiUrl()}/challenge/${token}/download`}
                            >
                                Download Challenge
                            </Button>
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
    };
};
export default connect(mapStateToProps, { loadChallenge })(LiveCodingChallenge);

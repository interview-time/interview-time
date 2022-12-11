import { RootState } from "../../store/state-models";
import { connect } from "react-redux";
import { getSharedScorecard } from "../../store/interviews/actions";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { selectSharedInterview } from "../../store/interviews/selector";
import { SharedInterview, TeamMember, TeamRole } from "../../store/models";
import Spinner from "../../components/spinner/spinner";
import { Result } from "antd";
import styles from "./interview-report.module.css";
import Card from "../../components/card/card";
import { getDecisionColor } from "../../utils/assessment";
import { Typography } from "antd";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import ScorecardReportSection from "../../components/scorecard/scorecard-report-section";
import { v4 as uuidv4 } from "uuid";
import { Logo } from "../../components/logo/logo";

const { Title } = Typography;

type Props = {
    interview: SharedInterview | undefined;
    interviewers: TeamMember[];
    loading: Boolean;
    getSharedScorecard: Function;
};

const InterviewReportShared = ({ interview, interviewers, loading, getSharedScorecard }: Props) => {
    // @ts-ignore
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            getSharedScorecard(token);
        }
    }, [token, getSharedScorecard]);

    if (loading) {
        return <Spinner />;
    }

    if (!interview) {
        return <Result status='404' subTitle='Interview report is no longer available' />;
    }

    return (
        <div className={styles.rootContainer}>
            <div className={styles.header}>
                <Logo />
            </div>

            <ScorecardReportSection
                interview={interview}
                interviewers={interviewers}
                header={
                    <Card
                        className={styles.decisionCard}
                        style={{ borderColor: getDecisionColor(interview.decision), width: "100%" }}
                    >
                        <div className={styles.decisionTextHolder}>
                            <Title level={4} style={{ margin: "0 10px 0 0" }}>
                                🎉 {interview?.candidateName || ""} scored a
                            </Title>

                            <InterviewDecisionTag decision={interview.decision} />
                        </div>
                    </Card>
                }
            />
        </div>
    );
};

const mapState = (state: RootState, ownProps: any) => {
    const interview = selectSharedInterview(state, ownProps.match.params.token);
    if (interview && !interview.userId) {
        interview.userId = uuidv4();
    }

    // interviewer created from interview because we don't have access to team members request
    const interviewers: TeamMember[] = [
        {
            userId: uuidv4(),
            name: interview?.interviewerName || "",
            email: "",
            isAdmin: false,
            roles: [TeamRole.INTERVIEWER],
        },
    ];

    return {
        interview: interview,
        interviewers,
        loading: state.interviews.loading,
    };
};

const mapDispatch = { getSharedScorecard };

export default connect(mapState, mapDispatch)(InterviewReportShared);

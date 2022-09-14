import styles from "./scorecard-report-section.module.css";
import { Col, Progress } from "antd";
import { Candidate, Interview, InterviewType, TeamMember } from "../../store/models";
import LiveCodingChallengeCard from "../scorecard/type-live-coding/challenge-card-readonly";
import { defaultTo } from "lodash";
import LiveCodingAssessmentCard from "../scorecard/type-live-coding/assessment-card-readonly";
import { selectAssessmentGroup } from "../../store/interviews/selector";
import React, { ReactNode } from "react";
import { SummaryNotesCard } from "./summary-notes";
import InterviewChartsCard from "./type-interview/charts-card";
import InterviewCompetenceAreaCard from "./type-interview/competence-area";
import { getOverallPerformanceColor, getOverallPerformancePercent } from "../../utils/assessment";
import Text from "antd/lib/typography/Text";
import { InterviewInfo } from "./interview-info";
import { CandidateInfo } from "./candidate-info";

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
    candidate?: Readonly<Candidate>;
    header?: ReactNode[] | ReactNode;
    footer?: ReactNode[] | ReactNode;
    onNotesChange?: (text: string) => void;
    onRedFlagsChange?: (flags: string[]) => void;
};

const ScorecardReportSection = ({
    interview,
    interviewers,
    candidate,
    header,
    footer,
    onNotesChange,
    onRedFlagsChange,
}: Props) => {
    return (
        <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }} className={styles.column}>
            {header}

            <div className={styles.reportInterviewInfoHolder}>
                <InterviewInfo interview={interview} interviewers={interviewers} />
                <div className={styles.reportInterviewCenter}>
                    {getOverallPerformancePercent(interview.structure.groups) > 0 && (
                        <Progress
                            type='circle'
                            status='active'
                            strokeLinecap='square'
                            trailColor='#E5E7EB'
                            width={160}
                            strokeWidth={8}
                            strokeColor={getOverallPerformanceColor(interview.structure.groups)}
                            percent={getOverallPerformancePercent(interview.structure.groups)}
                            format={percent => {
                                return (
                                    <div className={styles.scoreHolder}>
                                        <Text className={styles.scoreText}>{percent}</Text>
                                        <Text className={styles.scoreLabel} type='secondary'>
                                            Score
                                        </Text>
                                    </div>
                                );
                            }}
                        />
                    )}
                </div>
                <CandidateInfo className={styles.reportInterviewRight} candidate={candidate} />
            </div>

            {interview.interviewType === InterviewType.INTERVIEW && (
                <InterviewCompetenceAreaCard interview={interview} />
            )}

            {interview.interviewType === InterviewType.INTERVIEW && <InterviewChartsCard interview={interview} />}

            {interview.interviewType === InterviewType.LIVE_CODING && (
                <LiveCodingChallengeCard
                    challenge={defaultTo(interview.challenges, []).find(
                        challenge => challenge.challengeId === interview?.challengeDetails?.challengeId
                    )}
                />
            )}

            {interview.interviewType === InterviewType.LIVE_CODING && (
                <LiveCodingAssessmentCard questions={selectAssessmentGroup(interview).questions || []} />
            )}

            <SummaryNotesCard interview={interview} onNotesChange={onNotesChange} onRedFlagsChange={onRedFlagsChange} />

            {footer}
        </Col>
    );
};

export default ScorecardReportSection;

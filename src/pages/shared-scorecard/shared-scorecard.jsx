import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Col, Progress, Row, Space, Typography, Result } from "antd";
import { getSharedScorecard } from "../../store/interviews/actions";
import {
    getDecisionColor,
    getGroupAssessment,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
} from "../../utils/assessment";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import {
    filterGroupsWithAssessment,
    filterGroupsWithAssessmentNotes,
    filterQuestionsWithAssessmentNotes,
} from "../../utils/filters";
import { CalendarIcon, TimeIcon, UsersIcon } from "../../utils/icons";
import Spinner from "../../components/spinner/spinner";
import Card from "../../components/card/card";
import InterviewDecisionTag from "../../components/tags/interview-decision-tags";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";
import QuestionDifficultyChart from "../../components/charts/question-difficulty-chart";
import QuestionAnswersChart from "../../components/charts/question-answers-chart";
import CompetenceAreaChart from "../../components/charts/competence-area-chart";
import { getFormattedDate, getFormattedTimeRange } from "../../utils/date-fns";
import logo from "../../assets/logo-horiz.png";
import { RedFlagsTags } from "../../components/tags/red-flags-tags";
import { defaultTo } from "lodash/util";
import styles from "./shared-scorecard.module.css";
import { selectSharedScorecard } from "../../store/interviews/selector";

const { Text, Paragraph, Title } = Typography;

const SharedScorecard = ({ scorecard, loading, getSharedScorecard }) => {
    const [expanded, setExpanded] = useState(true);

    const { token } = useParams();

    useEffect(() => {
        if (token) {
            getSharedScorecard(token);
        }
    }, [token, getSharedScorecard]);

    const iconStyle = { fontSize: 20, color: "#374151" };

    const ChartsSection = () => {
        let groups = filterGroupsWithAssessment(scorecard.structure.groups);
        return (
            groups.length > 0 && (
                <Row gutter={24} style={{ paddingTop: 30 }}>
                    <Col span={8}>
                        <Card withPadding={false}>
                            <CompetenceAreaChart groups={groups} />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card withPadding={false}>
                            <QuestionDifficultyChart groups={groups} />
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card withPadding={false}>
                            <QuestionAnswersChart groups={groups} />
                        </Card>
                    </Col>
                </Row>
            )
        );
    };

    return (
        <div className={styles.rootContainer}>
            <div className={styles.header}>
                <a href='https://interviewtime.io'>
                    <img alt='InterviewTime' src={logo} className={styles.logo} />
                </a>
            </div>

            {scorecard ? (
                <>
                    <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }}>
                        <div className={styles.divVerticalCenter} style={{ paddingTop: 60 }}>
                            <Card
                                className={styles.decisionCard}
                                style={{ borderColor: getDecisionColor(scorecard.decision), width: "100%" }}
                            >
                                <div className={styles.decisionTextHolder}>
                                    <div className={styles.candidate}>
                                        <Title level={3} style={{ margin: "0 10px 0 0" }}>
                                            {scorecard.candidateName}
                                        </Title>
                                        <Text type='secondary' className={styles.subheader}>
                                            {scorecard.position}
                                        </Text>
                                    </div>

                                    <div className={styles.recommendation}>
                                        <InterviewDecisionTag decision={scorecard.decision} />

                                        <Text type='secondary' className={styles.subheader}>
                                            Hiring recommendation
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className={styles.reportInterviewInfoHolder} style={{ paddingTop: 30, paddingBottom: 30 }}>
                            <Space direction='vertical' size={12}>
                                <div className={styles.divHorizontal}>
                                    <UsersIcon style={iconStyle} />
                                    <Text className={styles.reportLabel}>Interviewer: {scorecard.interviewerName}</Text>
                                </div>
                                <div className={styles.divHorizontal}>
                                    <CalendarIcon style={iconStyle} />
                                    <Text className={styles.reportLabel}>
                                        {getFormattedDate(scorecard.interviewStartDateTime)}
                                    </Text>
                                </div>
                                <div className={styles.divHorizontal}>
                                    <TimeIcon style={iconStyle} />
                                    <Text className={styles.reportLabel}>
                                        {getFormattedTimeRange(
                                            scorecard.interviewStartDateTime,
                                            scorecard.interviewEndDateTime
                                        )}
                                    </Text>
                                </div>
                            </Space>
                            <div className={styles.reportInterviewCenter}>
                                {getOverallPerformancePercent(scorecard.structure.groups) > 0 && (
                                    <Progress
                                        type='circle'
                                        status='active'
                                        strokeLinecap='square'
                                        trailColor='#E5E7EB'
                                        width={160}
                                        strokeWidth={8}
                                        strokeColor={getOverallPerformanceColor(scorecard.structure.groups)}
                                        percent={getOverallPerformancePercent(scorecard.structure.groups)}
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
                        </div>
                        <Card withPadding={false}>
                            <div className={styles.divSpaceBetween} style={{ padding: 24 }}>
                                <Title level={4} style={{ margin: 0 }}>
                                    Competence areas
                                </Title>
                                {!expanded && <Button onClick={() => setExpanded(true)}>Expand</Button>}
                                {expanded && <Button onClick={() => setExpanded(false)}>Collapse</Button>}
                            </div>
                            {filterGroupsWithAssessmentNotes(scorecard.structure.groups)
                                .map(group => ({
                                    group: group,
                                    assessment: getGroupAssessment(group.questions),
                                }))
                                .map(({ assessment, group }) => (
                                    <>
                                        <div className={styles.divider} />
                                        <div
                                            className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                                            style={{ backgroundColor: expanded ? "#F9FAFB" : "#FFFFFF" }}
                                        >
                                            <Text strong>{group.name}</Text>
                                            <div className={styles.divHorizontalCenter}>
                                                <Text type='secondary' style={{ marginRight: 12 }}>
                                                    {assessment.text}
                                                </Text>
                                                <Progress
                                                    type='line'
                                                    status='active'
                                                    strokeLinecap='square'
                                                    strokeColor={assessment.color}
                                                    trailColor='#E5E7EB'
                                                    steps={10}
                                                    strokeWidth={16}
                                                    percent={assessment.score}
                                                    format={percent => <Text type='secondary'>{percent}%</Text>}
                                                />
                                            </div>
                                        </div>
                                        {expanded &&
                                            filterQuestionsWithAssessmentNotes(group).map(question => (
                                                <>
                                                    <div className={styles.divider} />
                                                    <div className={styles.questionAreaRow}>
                                                        <QuestionDifficultyTag difficulty={question.difficulty} />
                                                        <div className={styles.questionHolder}>
                                                            <Text>{question.question}</Text>
                                                            <Text className={styles.questionNotes} type='secondary'>
                                                                {question.notes}
                                                            </Text>
                                                        </div>
                                                        <AssessmentCheckbox
                                                            defaultValue={question.assessment}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </>
                                            ))}
                                    </>
                                ))}
                        </Card>

                        {ChartsSection()}

                        <Row className={styles.notesRoot}  gutter={24}>
                            <Col span={16}>
                                <Card withPadding={false} className={styles.notesCard}>
                                    <Title level={4} className={styles.notesTitle}>
                                        Summary notes
                                    </Title>
                                    <div className={styles.divider} />
                                    <Paragraph className={styles.notesTextArea}>
                                        {scorecard.notes ? scorecard.notes : "No summary was left"}
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card withPadding={false} className={styles.notesCard}>
                                    <Title level={4} className={styles.notesTitle}>
                                        Red flags
                                    </Title>
                                    <div className={styles.divider} />
                                    <div className={styles.redFlagsHolder}>
                                        <RedFlagsTags flags={defaultTo(scorecard.redFlags, [])} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </>
            ) : loading ? (
                <Spinner />
            ) : (
                <Result status='404' subTitle='Scorecard is no longer available' />
            )}
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        scorecard: selectSharedScorecard(state, ownProps.match.params.token),
        loading: state.interviews.loading,
    };
};
export default connect(mapStateToProps, { getSharedScorecard })(SharedScorecard);

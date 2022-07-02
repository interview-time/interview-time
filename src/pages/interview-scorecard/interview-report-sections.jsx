import styles from "./interview-report-sections.module.css";
import { CandidateInfoSection, InterviewInfoSection } from "./interview-sections";
import { getGroupAssessment, getOverallPerformanceColor, getOverallPerformancePercent } from "../../utils/assessment";
import { Button, Col, Progress, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import {
    filterGroupsWithAssessment,
    filterGroupsWithAssessmentNotes,
    filterQuestionsWithAssessmentNotes,
} from "../../utils/filters";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";
import AssessmentCheckbox from "../../components/questions/assessment-checkbox";
import Card from "../../components/card/card";
import { useState } from "react";
import CompetenceAreaChart from "../../components/charts/competence-area-chart";
import QuestionDifficultyChart from "../../components/charts/question-difficulty-chart";
import QuestionAnswersChart from "../../components/charts/question-answers-chart";
import Paragraph from "antd/lib/typography/Paragraph";
import { Status } from "../../utils/constants";
import TextArea from "antd/lib/input/TextArea";

/**
 *
 * @param {Interview} interview
 * @param {TeamMember[]} teamMembers
 * @param {Candidate|undefined} candidate
 * @returns {JSX.Element}
 * @constructor
 */
export const ScoreSection = ({ interview, teamMembers, candidate }) => (
    <div className={styles.reportInterviewInfoHolder}>
        <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
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
        <CandidateInfoSection className={styles.reportInterviewRight} candidate={candidate} />
    </div>
);

/**
 *  @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
export const CompetenceAreaSection = ({ interview }) => {
    const [expanded, setExpanded] = useState(false);

    const onExpandClicked = () => setExpanded(true);

    const onCollapseClicked = () => setExpanded(false);

    return (
        <Card withPadding={false}>
            <div className={styles.divSpaceBetween} style={{ padding: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Competence areas
                </Title>
                {!expanded && <Button onClick={onExpandClicked}>Expand</Button>}
                {expanded && <Button onClick={onCollapseClicked}>Collapse</Button>}
            </div>
            {filterGroupsWithAssessmentNotes(interview.structure.groups)
                .map(group => ({
                    group: group,
                    assessment: getGroupAssessment(group.questions),
                }))
                .map(({ assessment, group }) => (
                    <>
                        <div className={styles.divider} />
                        <div
                            className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                            style={{ backgroundColor: expanded ? "#F9FAFB" : null }}
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
                                        <AssessmentCheckbox defaultValue={question.assessment} disabled={true} />
                                    </div>
                                </>
                            ))}
                    </>
                ))}
        </Card>
    );
};

/**
 *
 * @param {Interview} interview
 * @returns {false|JSX.Element}
 * @constructor
 */
export const ChartsSection = ({ interview }) => {
    let groups = filterGroupsWithAssessment(interview.structure.groups);
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

/**
 *
 * @param {Interview} interview
 * @param {boolean} editable
 * @param  onNoteChanges
 * @returns {JSX.Element}
 * @constructor
 */
export const SummaryNotes = ({ interview, editable, onNoteChanges }) => {
    return (
        <Card withPadding={false} className={styles.notesCard}>
            <Title level={4} className={styles.notesTitle}>
                Summary notes
            </Title>
            <div className={styles.divider} />
            {!editable && (
                <Paragraph className={styles.notesTextArea}>
                    {interview.notes ? interview.notes : "No summary was left"}
                </Paragraph>
            )}
            {editable && (
                <TextArea
                    {...(interview.status === Status.SUBMITTED ? { readonly: "true" } : {})}
                    className={styles.notesTextArea}
                    placeholder='No summary was left, you can still add notes now'
                    bordered={false}
                    autoSize={{ minRows: 1 }}
                    onChange={onNoteChanges}
                    defaultValue={interview.notes}
                />
            )}
        </Card>
    );
};

import { useState } from "react";
import Card from "../../card/card";
import styles from "./competence-area.module.css";
import Title from "antd/lib/typography/Title";
import { Button, Progress } from "antd";
import { filterGroupsWithAssessmentNotes, filterQuestionsWithAssessmentNotes } from "../../../utils/filters";
import { getGroupAssessment } from "../../../utils/assessment";
import Text from "antd/lib/typography/Text";
import QuestionDifficultyTag from "../../tags/question-difficulty-tag";
import AssessmentCheckbox from "../../questions/assessment-checkbox";
import { Interview, InterviewQuestion, InterviewStructureGroup } from "../../../store/models";

type Props = {
    interview: Readonly<Interview>;
};

const InterviewCompetenceAreaCard = ({ interview }: Props) => {
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
            {filterGroupsWithAssessmentNotes(interview.structure.groups).map((group: InterviewStructureGroup) => {
                const assessment = getGroupAssessment(group.questions);
                return (
                    <>
                        <div className={styles.divider} />
                        <div
                            className={`${styles.divSpaceBetween} ${styles.competenceAreaRow}`}
                            style={{ backgroundColor: expanded ? "#F9FAFB" : undefined }}
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
                            filterQuestionsWithAssessmentNotes(group).map((question: InterviewQuestion) => (
                                <>
                                    <div className={styles.divider} />
                                    <div className={styles.questionAreaRow}>
                                        {/* @ts-ignore */}
                                        <QuestionDifficultyTag difficulty={question.difficulty} />
                                        <div className={styles.questionHolder}>
                                            <Text>{question.question}</Text>
                                            <Text className={styles.questionNotes} type='secondary'>
                                                {question.notes}
                                            </Text>
                                        </div>
                                        {/* @ts-ignore */}
                                        <AssessmentCheckbox defaultValue={question.assessment} disabled={true} />
                                    </div>
                                </>
                            ))}
                    </>
                );
            })}
        </Card>
    );
};

export default InterviewCompetenceAreaCard;

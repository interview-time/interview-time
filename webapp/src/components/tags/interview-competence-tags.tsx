import styles from "./interview-competence-tags.module.css";
import { Col, Popover, Row, Space } from "antd";
import React from "react";
import { getGroupAssessment } from "../../utils/assessment";
import { filterGroupsWithAssessment } from "../../utils/filters";
import { Interview, InterviewStructureGroup } from "../../store/models";

type Props = {
    interview: Interview;
    max: number;
};
const InterviewCompetenceTag = ({ interview, max = 99 }: Props) => {
    type AssessmentGroup = {
        group: InterviewStructureGroup;
        assessment: Assessment;
    };

    type Assessment = {
        score: number;
        text: string;
        color: string;
    };

    let data: AssessmentGroup[] = filterGroupsWithAssessment(interview.structure.groups ?? [])
        .slice(0, max)
        .map((group: InterviewStructureGroup) => ({
            group: group,
            assessment: getGroupAssessment(group.questions),
        }));

    return (
        <Popover
            title='Competence Areas'
            content={
                <Space direction='vertical' className={styles.assessmentPopup}>
                    {data.map(({ assessment, group }) => (
                        <Row gutter={16} key={group.groupId}>
                            <Col span={12}>{group.name}</Col>
                            <Col span={12}>
                                <span
                                    className={styles.dot}
                                    style={{
                                        backgroundColor: assessment.color,
                                        marginLeft: 16,
                                        marginRight: 16,
                                    }}
                                />
                                <span>{assessment.text}</span>
                            </Col>
                        </Row>
                    ))}
                </Space>
            }
        >
            <Space size={4}>
                {data.map(({ assessment }) => (
                    <span className={styles.dot} style={{ backgroundColor: assessment.color }} />
                ))}
            </Space>
        </Popover>
    );
};

export default InterviewCompetenceTag;

import styles from "./interview-competence-tags.module.css";
import { Col, Popover, Row, Space } from "antd";
import React from "react";
import { getGroupAssessment } from "../../utils/assessment";
import { filterGroupsWithAssessment } from "../../utils/filters";

/**
 *
 * @param {Interview} interview
 * @param {int} max
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewCompetenceTag = ({ interview, max = 99 }) => {
    let data = filterGroupsWithAssessment(interview.structure.groups)
        .slice(0, max)
        .map(group => ({
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

import styles from "./interview-competence-tags.module.css";
import { Col, Popover, Row, Space } from "antd";
import React from "react";
import { getGroupAssessmentColor, getGroupAssessmentText } from "../utils/assessment";
import { filterGroupsWithAssessment } from "../utils/filters";

/**
 *
 * @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewCompetenceTag = ({ interview }) => {

    return <Popover title="Competence Areas" content={
        <Space direction="vertical" className={styles.assessmentPopup}>
            {filterGroupsWithAssessment(interview.structure.groups).map(group => {
                return <Row gutter={16}>
                    <Col span={12}>{group.name}</Col>
                    <Col span={12}>
                        <span className={styles.dot}
                              style={{
                                  backgroundColor: getGroupAssessmentColor(group),
                                  marginLeft: 16,
                                  marginRight: 16
                              }} />
                        <span>{getGroupAssessmentText(group)}</span>
                    </Col>
                </Row>
            })}
        </Space>
    }>
        <Space size={4}>
            {interview.structure.groups.map(group =>
                <span className={styles.dot}
                      style={{ backgroundColor: getGroupAssessmentColor(group) }} />)}
        </Space>
    </Popover>
}

export default InterviewCompetenceTag
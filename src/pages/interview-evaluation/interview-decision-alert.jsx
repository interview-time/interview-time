import { Alert, Tag } from "antd";
import { getDecisionColor, getDecisionText, InterviewAssessment } from "../../components/utils/constants";
import React from "react";
import styles from "./interviews-evaluation.module.css";

/**
 *
 * @param {Interview} interview
 * @returns {JSX.Element}
 * @constructor
 */
const InterviewDecisionAlert = ({ interview }) => {

    const getDecisionAlertType = (decision) =>
        decision === InterviewAssessment.STRONG_YES || decision === InterviewAssessment.YES ? "success" : "error"

    const getQualifiedAlertType = (decision) =>
        decision === InterviewAssessment.STRONG_YES || decision === InterviewAssessment.YES ?
            "Candidate is qualified for the position" : "Candidate is not qualified for the position"

    return (
        <Alert message={
            <div className={styles.divAlert}>
                <span>{getQualifiedAlertType(interview.decision)}</span>
                <Tag color={getDecisionColor(interview.decision)}>
                    {getDecisionText(interview.decision)}
                </Tag>
            </div>
        }
               type={getDecisionAlertType(interview.decision)}
               style={{ marginBottom: 12 }}>

        </Alert>
    )
}

export default InterviewDecisionAlert
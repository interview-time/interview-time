import styles from "../type-live-coding/step-assessment-live-coding.module.css";
import { InterviewInfo } from "../../../../components/scorecard/interview-info";
import { CandidateInfo } from "../../../../components/scorecard/candidate-info";
import Card from "../../../../components/card/card";
import { IntroSection } from "../type-interview/interview-sections";
import React from "react";
import { Col } from "antd";
import { Candidate, Interview, TeamMember } from "../../../../store/models";
import { ReducerAction } from "../../interview-reducer";
import { selectAssessmentGroup } from "../../../../store/interviews/selector";
import LiveCodingAssessmentCard from "../../../../components/scorecard/type-live-coding/assessment-card-editable";

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
    candidate?: Readonly<Candidate>;
    onInterviewChange: (action: ReducerAction) => void;
}

const StepAssessmentTakeHome = ({ interview, interviewers, candidate, onInterviewChange }: Props) => {

    return (
        <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }} className={styles.column}>
            <div className={styles.divSpaceBetween}>
                <InterviewInfo interview={interview} interviewers={interviewers} />
                <CandidateInfo candidate={candidate} />
            </div>

            <Card>
                {/* @ts-ignore */}
                <IntroSection interview={interview} />
            </Card>

            {/*<LiveCodingAssessmentCard*/}
            {/*    questions={selectAssessmentGroup(interview).questions || []}*/}
            {/*    onQuestionNotesChanged={onQuestionNotesChanged}*/}
            {/*    onQuestionAssessmentChanged={onQuestionAssessmentChanged}*/}
            {/*/>*/}
        </Col>
    )
}

export default StepAssessmentTakeHome;
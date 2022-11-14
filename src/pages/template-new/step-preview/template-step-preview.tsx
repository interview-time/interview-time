import { InterviewType, LiveCodingChallenge, Template } from "../../../store/models";
import { Col, Row } from "antd";
import styles from "./template-step-preview.module.css";
import InfoCircleIcon from "../../../assets/icons/info-circle.svg";
import Text from "antd/lib/typography/Text";
import Card from "../../../components/card/card";
import {
    IntroSection,
    TemplateGroupsSection,
} from "../../interview-scorecard/step-assessment/type-interview/interview-sections";
import React from "react";
import { selectAssessmentGroup, selectTakeHomeAssignment } from "../../../store/templates/selector";
import LiveCodingAssessmentCard from "../../../components/scorecard/type-live-coding/assessment-card-template";
import LiveCodingChallengeCard from "../../../components/scorecard/type-live-coding/challenge-card-template";
import { ReducerAction, ReducerActionType } from "../template-reducer";
import TakeHomeChallengeCard from "../../../components/scorecard/type-take-home/challenge-card-template";

type Props = {
    template: Readonly<Template>;
    onTemplateChange: (action: ReducerAction) => void;
};

const TemplateStepPreview = ({ template, onTemplateChange }: Props) => {
    const onChallengeSelectionChanged = (selected: boolean, challenge: LiveCodingChallenge) => {
        const newChallenge = {
            ...challenge,
            selected: selected,
        };
        onTemplateChange({
            type: ReducerActionType.UPDATE_CHALLENGE,
            challenge: newChallenge,
            mutateState: false,
        });
    };

    return (
        <Row justify='center'>
            <Col span={24} xl={{ span: 20 }} xxl={{ span: 16 }} className={styles.column}>
                <div className={styles.infoCard}>
                    <img src={InfoCircleIcon} alt='Info icon' />
                    <Text className={styles.infoText}>
                        This is a preview of the experience that will be available during the interview.
                    </Text>
                </div>
                <Card>
                    {/* @ts-ignore */}
                    <IntroSection interview={template} />
                </Card>
                {template.interviewType === InterviewType.INTERVIEW && (
                    /* @ts-ignore */
                    <TemplateGroupsSection template={template} />
                )}
                {template.interviewType === InterviewType.LIVE_CODING && (
                    <>
                        <LiveCodingChallengeCard
                            teamId={template.teamId}
                            challenges={template.challenges || []}
                            onChallengeSelectionChanged={onChallengeSelectionChanged}
                        />
                        <LiveCodingAssessmentCard questions={selectAssessmentGroup(template).questions || []} />
                    </>
                )}
                {template.interviewType === InterviewType.TAKE_HOME_TASK && (
                    <>
                        <TakeHomeChallengeCard
                            teamId={template.teamId}
                            challenge={selectTakeHomeAssignment(template)}
                        />
                        <LiveCodingAssessmentCard questions={selectAssessmentGroup(template).questions || []} />
                    </>
                )}
            </Col>
        </Row>
    );
};

export default TemplateStepPreview;

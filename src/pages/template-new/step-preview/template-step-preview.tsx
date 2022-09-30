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
import { selectAssessmentGroup } from "../../../store/templates/selector";
import LiveCodingAssessmentCard from "../../../components/scorecard/type-live-coding/assessment-card-template";
import LiveCodingChallengeCard from "../../../components/scorecard/type-live-coding/challenge-card-template";
import { ReducerAction, ReducerActionType } from "../template-reducer";

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
        });
    };

    return (
        <Row justify='center'>
            <Col span={24} xl={{ span: 20 }} xxl={{ span: 16 }} className={styles.rootCol}>
                <div className={styles.infoCard}>
                    <img src={InfoCircleIcon} alt='Info icon' />
                    <Text className={styles.infoText}>
                        This is a preview of the experience that will be available during the interview.
                    </Text>
                </div>
                <Card className={styles.cardSpace}>
                    {/* @ts-ignore */}
                    <IntroSection interview={template} />
                </Card>
                {template.interviewType === InterviewType.INTERVIEW && (
                    <div className={styles.cardSpace}>
                        {/* @ts-ignore */}
                        <TemplateGroupsSection template={template} />
                    </div>
                )}
                {template.interviewType === InterviewType.LIVE_CODING && (
                    <>
                        <div className={styles.cardSpace}>
                            <LiveCodingChallengeCard
                                teamId={template.teamId}
                                challenges={template.challenges || []}
                                onChallengeSelectionChanged={onChallengeSelectionChanged}
                            />
                        </div>
                        <div className={styles.cardSpace}>
                            <LiveCodingAssessmentCard questions={selectAssessmentGroup(template).questions || []} />
                        </div>
                    </>
                )}
            </Col>
        </Row>
    );
};

export default TemplateStepPreview;

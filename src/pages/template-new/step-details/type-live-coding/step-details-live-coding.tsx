import { Challenge, QuestionDifficulty, Template, TemplateQuestion } from "../../../../store/models";
import styles from "../type-interview/step-details-interview.module.css";
import { Col, Form, Row } from "antd";
import TemplateMetaCard from "../template-meta-card";
import React, { useState } from "react";
import TemplateHeaderCard from "../template-header-card";
import TemplateFooterCard from "../template-footer-card";
import LiveCodingAssessmentModal from "./live-coding-assessment-modal";
import LiveCodingChallengeCard from "./live-coding-challenge-card";
import { ReducerAction, ReducerActionType } from "../../template-reducer";
import { selectAssessmentGroup } from "../../../../store/templates/selector";
import LiveCodingAssessmentCard from "./live-coding-assessment-card";
import LiveCodingChallengeModal from "./live-coding-challenge-modal";

type Props = {
    template: Readonly<Template>;
    teamId: string;
    onTemplateChange: (action: ReducerAction) => void;
};

type AssessmentModal = {
    visible: boolean;
    name: string;
    questionId: string;
};

type TaskModal = {
    visible: boolean;
    challenge: Challenge | null;
};

const StepDetailsLiveCoding = ({ template, teamId, onTemplateChange }: Props) => {
    const [assessmentModal, setAssessmentModal] = useState<AssessmentModal>({
        visible: false,
        name: "",
        questionId: "",
    });

    const [challengeModal, setChallengeModal] = useState<TaskModal>({
        visible: false,
        challenge: null,
    });

    // MARK: Template metadata

    const onTitleChange = (title: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_TITLE,
            title: title,
        });
    };

    const onDescriptionChange = (description: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_DESCRIPTION,
            description: description,
        });
    };

    // MARK: Reminders

    const onHeaderChanged = (header: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_HEADER,
            header: header,
        });
    };

    const onFooterChanged = (footer: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_FOOTER,
            footer: footer,
        });
    };

    // MARK: Assessments

    const onAddAssessmentClicked = () => {
        setAssessmentModal({
            ...assessmentModal,
            visible: true,
            questionId: "",
            name: "",
        });
    };

    const onUpdateQuestionClicked = (question: TemplateQuestion) => {
        setAssessmentModal({
            ...assessmentModal,
            visible: true,
            name: question.question,
            questionId: question.questionId,
        });
    };

    const onAssessmentModalCancel = () => {
        setAssessmentModal({
            ...assessmentModal,
            visible: false,
        });
    };

    const onAssessmentModalUpdate = (questionId: string, name: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_QUESTION,
            groupId: selectAssessmentGroup(template).groupId,
            questionId: questionId,
            name: name,
        });
        setAssessmentModal({
            ...assessmentModal,
            visible: false,
        });
    };

    const onAssessmentModalDelete = (questionId: string) => {
        onTemplateChange({
            type: ReducerActionType.REMOVE_QUESTION,
            groupId: selectAssessmentGroup(template).groupId,
            questionId: questionId,
        });

        setAssessmentModal({
            ...assessmentModal,
            visible: false,
        });
    };

    const onAssessmentModalAdd = (name: string) => {
        const assessmentId = Date.now().toString();
        onTemplateChange({
            type: ReducerActionType.ADD_QUESTION,
            groupId: selectAssessmentGroup(template).groupId,
            question: {
                questionId: assessmentId,
                question: name,
                difficulty: QuestionDifficulty.EASY,
            },
        });
        setAssessmentModal({
            ...assessmentModal,
            visible: false,
        });
    };

    const onQuestionSorted = (groupId: string, oldIndex: number, newIndex: number) => {
        onTemplateChange({
            type: ReducerActionType.MOVE_QUESTION,
            groupId: groupId,
            oldIndex: oldIndex,
            newIndex: newIndex,
        });
    };

    // MARK: Task

    const onChallengeModalCancel = () => {
        setChallengeModal({
            ...challengeModal,
            visible: false,
        });
    };

    const onNewChallengeClicked = () => {
        setChallengeModal({
            ...challengeModal,
            visible: true,
            challenge: null,
        });
    };

    const onAddChallenge = (challenge: Challenge) => {
        setChallengeModal({
            ...challengeModal,
            visible: false,
        });
        onTemplateChange({
            type: ReducerActionType.ADD_CHALLENGE,
            challenge: challenge,
        });
    };

    const onUpdateChallengeClicked = (challenge: Challenge) => {
        setChallengeModal({
            ...assessmentModal,
            visible: true,
            challenge: challenge,
        });
    };

    const onUpdateChallenge = (challenge: Challenge) => {
        setChallengeModal({
            ...challengeModal,
            visible: false,
        });
        onTemplateChange({
            type: ReducerActionType.UPDATE_CHALLENGE,
            challenge: challenge,
        });
    };

    const onChallengeDelete = (challenge: Challenge) => {
        setChallengeModal({
            ...challengeModal,
            visible: false,
        });
        onTemplateChange({
            type: ReducerActionType.REMOVE_CHALLENGE,
            challenge: challenge,
        });
    };

    const onChallengeSorted = (oldIndex: number, newIndex: number) => {
        onTemplateChange({
            type: ReducerActionType.MOVE_CHALLENGE,
            oldIndex: oldIndex,
            newIndex: newIndex,
        });
    };

    return (
        <Row justify='center'>
            <Col span={24} xl={{ span: 20 }} xxl={{ span: 16 }} className={styles.rootCol}>
                <Form
                    name='basic'
                    layout='vertical'
                    initialValues={{
                        title: template.title,
                        description: template.description,
                    }}
                >
                    <TemplateMetaCard
                        interviewType={template.interviewType}
                        onTitleChange={onTitleChange}
                        onDescriptionChange={onDescriptionChange}
                    />

                    <TemplateHeaderCard header={template.structure.header} onHeaderChanged={onHeaderChanged} />

                    <LiveCodingChallengeCard
                        challenges={template.challenges ?? []}
                        onNewChallengeClicked={onNewChallengeClicked}
                        onChallengeSorted={onChallengeSorted}
                        onUpdateChallengeClicked={onUpdateChallengeClicked}
                    />

                    <LiveCodingAssessmentCard
                        group={selectAssessmentGroup(template)}
                        onAddAssessmentClicked={onAddAssessmentClicked}
                        onQuestionSorted={onQuestionSorted}
                        onUpdateQuestionClicked={onUpdateQuestionClicked}
                    />

                    <TemplateFooterCard footer={template.structure.footer} onFooterChanged={onFooterChanged} />
                </Form>

                <LiveCodingAssessmentModal
                    visible={assessmentModal.visible}
                    name={assessmentModal.name}
                    questionId={assessmentModal.questionId}
                    onCancel={onAssessmentModalCancel}
                    onAdd={onAssessmentModalAdd}
                    onUpdate={onAssessmentModalUpdate}
                    onDelete={onAssessmentModalDelete}
                />

                <LiveCodingChallengeModal
                    visible={challengeModal.visible}
                    existingChallenge={challengeModal.challenge}
                    teamId={teamId}
                    onCancel={onChallengeModalCancel}
                    onAdd={onAddChallenge}
                    onUpdate={onUpdateChallenge}
                    onDelete={onChallengeDelete}
                />
            </Col>
        </Row>
    );
};

export default StepDetailsLiveCoding;

import { TemplateChallenge, QuestionDifficulty, Template, TemplateQuestion } from "../../../../store/models";
import styles from "./step-details-take-home.module.css";
import { Col, Form, Row } from "antd";
import TemplateMetaCard from "../template-meta-card";
import React, { useState } from "react";
import TemplateHeaderCard from "../template-header-card";
import { ReducerAction, ReducerActionType } from "../../template-reducer";
import { selectAssessmentGroup, selectTakeHomeAssignment } from "../../../../store/templates/selector";
import LiveCodingAssessmentCard from "../type-live-coding/live-coding-assessment-card";
import LiveCodingAssessmentModal from "../type-live-coding/live-coding-assessment-modal";
import TakeHomeChallengeCard from "./take-home-challenge-card";

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

const StepDetailsTakeHome = ({ template, teamId, onTemplateChange }: Props) => {
    const [assessmentModal, setAssessmentModal] = useState<AssessmentModal>({
        visible: false,
        name: "",
        questionId: "",
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

    const onUpdateChallenge = (challenge: TemplateChallenge) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_CHALLENGE,
            challenge: challenge,
            mutateState: true
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

                    <TakeHomeChallengeCard
                        teamId={teamId}
                        challenge={selectTakeHomeAssignment(template)}
                        onUpdateChallenge={onUpdateChallenge}
                    />

                    <LiveCodingAssessmentCard
                        group={selectAssessmentGroup(template)}
                        onAddAssessmentClicked={onAddAssessmentClicked}
                        onQuestionSorted={onQuestionSorted}
                        onUpdateQuestionClicked={onUpdateQuestionClicked}
                    />

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

            </Col>
        </Row>
    );
};

export default StepDetailsTakeHome;

import { QuestionDifficulty, Template, TemplateGroup, TemplateQuestion } from "../../../../store/models";
import styles from "./step-details-interview.module.css";
import TemplateMetaCard from "../template-meta-card";
import React, { useState } from "react";
import { Button, Col, Form, Row } from "antd";
import TemplateHeaderCard from "../template-header-card";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { TemplateQuestionsCard } from "./template-questions-card";
import { PlusOutlined } from "@ant-design/icons";
import Card from "../../../../components/card/card";
import { sortBy } from "lodash";
import TemplateGroupModal from "./template-group-modal";
import TemplateFooterCard from "../template-footer-card";
import { ReducerAction, ReducerActionType } from "../../template-reducer";

type Props = {
    template: Readonly<Template>;
    onTemplateChange: (action: ReducerAction) => void;
    allQuestionTags: string[];
};

type QuestionGroupModal = {
    visible: boolean;
    name: string | null;
    id: string | null;
};

/**
 * StepDetailsInterview component is a heavy component which renders a lot of data, therefore performance optimization
 * techniques have been added to improve performance:
 * - all state updates are done through parent component
 * - every question group is split into separate component with `React.memo` wrapper with custom `areEqual` function to re-render components only when group questions changed
 * - template state update is only done when necessary, e.g. when user adds question we trigger state update, but when user edit template title we modify state directly
 */
const StepDetailsInterview = ({ template, onTemplateChange, allQuestionTags }: Props) => {
    const [questionsTags, setQuestionsTags] = useState<string[]>(allQuestionTags);
    const [questionGroupModal, setQuestionGroupModal] = useState<QuestionGroupModal>({
        visible: false,
        name: null,
        id: null,
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

    // MARK: Questions

    const onAddQuestionClicked = (groupId: string) => {
        const group = template.structure.groups.find(group => group.groupId === groupId)!;
        const questionIndex = group.questions.length - 1;

        onTemplateChange({
            type: ReducerActionType.ADD_QUESTION,
            groupId: groupId,
            question: {
                questionId: Date.now().toString(),
                question: "",
                tags: [],
                difficulty: QuestionDifficulty.MEDIUM,
                // @ts-ignore
                key: questionIndex,
                index: questionIndex,
            },
        });
    };

    const onRemoveQuestionClicked = (groupId: string, questionId: string) => {
        onTemplateChange({
            type: ReducerActionType.REMOVE_QUESTION,
            groupId: groupId,
            questionId: questionId,
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

    const onQuestionChange = (question: TemplateQuestion, text: string) => {
        // no need to update component state
        question.question = text;
    };

    const onDifficultyChange = (question: TemplateQuestion, difficulty: QuestionDifficulty) => {
        // no need to update component state
        question.difficulty = difficulty;
    };

    const onTagsChange = (question: TemplateQuestion, questionTags: string[]) => {
        // no need to update component state
        question.tags = questionTags;

        // only update state if new tag was added
        const newTags = questionTags.filter(tag => !questionsTags.includes(tag));
        if (newTags.length !== 0) {
            setQuestionsTags(allTags => {
                return sortBy(allTags.concat(newTags));
            });
        }
    };

    // MARK: Groups management

    const onGroupTitleClicked = (id: string, name: string) => {
        setQuestionGroupModal({
            visible: true,
            name: name,
            id: id,
        });
    };

    const onAddQuestionGroupClicked = () => {
        setQuestionGroupModal({
            visible: true,
            name: null,
            id: null,
        });
    };

    const onDeleteGroupClicked = (id: string) => {
        onTemplateChange({
            type: ReducerActionType.REMOVE_GROUP,
            groupId: id,
        });
    };

    const onGroupModalCancel = () => {
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false,
        });
    };

    const onGroupModalUpdate = (id: string, name: string) => {
        onTemplateChange({
            type: ReducerActionType.UPDATE_GROUP,
            groupId: id,
            name: name,
        });
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false,
        });
    };

    const onGroupModalAdd = (name: string) => {
        const groupId = Date.now().toString();
        onTemplateChange({
            type: ReducerActionType.ADD_GROUP,
            group: {
                groupId: groupId,
                name: name,
                questions: [],
            },
        });
        setQuestionGroupModal({
            ...questionGroupModal,
            visible: false,
        });
    };

    const onMoveGroupUpClicked = (id: string) => {
        const fromIndex = template.structure.groups.findIndex(g => g.groupId === id);
        const toIndex = fromIndex - 1;

        onTemplateChange({
            type: ReducerActionType.MOVE_GROUP,
            oldIndex: fromIndex,
            newIndex: toIndex,
        });
    };

    const onMoveGroupDownClicked = (id: string) => {
        const fromIndex = template.structure.groups.findIndex(g => g.groupId === id);
        const toIndex = fromIndex + 1;
        onTemplateChange({
            type: ReducerActionType.MOVE_GROUP,
            oldIndex: fromIndex,
            newIndex: toIndex,
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

                    <Card className={styles.cardSpace}>
                        <Title level={4}>Questions</Title>
                        <Text type='secondary'>
                            Grouping questions helps to evaluate skills in a particular competence area and make a more
                            granular assessment.
                        </Text>
                        <div>
                            {template.structure.groups.map((group: TemplateGroup, index) => {
                                console.log(index, group)
                                return (
                                    <TemplateQuestionsCard
                                        key={group.groupId} /* @ts-ignore */
                                        group={group}
                                        isFirstGroup={index === 0}
                                        isLastGroup={index === template.structure.groups.length - 1}
                                        allTags={questionsTags}
                                        onAddQuestionClicked={onAddQuestionClicked}
                                        onRemoveQuestionClicked={onRemoveQuestionClicked}
                                        onQuestionSorted={onQuestionSorted}
                                        onQuestionChange={onQuestionChange}
                                        onDifficultyChange={onDifficultyChange}
                                        onTagsChange={onTagsChange}
                                        onGroupTitleClicked={onGroupTitleClicked}
                                        onDeleteGroupClicked={onDeleteGroupClicked}
                                        onMoveGroupUpClicked={onMoveGroupUpClicked}
                                        onMoveGroupDownClicked={onMoveGroupDownClicked}
                                    />
                                );
                            })}
                        </div>
                        <Button
                            style={{ marginTop: 12 }}
                            icon={<PlusOutlined />}
                            type='primary'
                            ghost
                            onClick={onAddQuestionGroupClicked}
                        >
                            New question group
                        </Button>
                    </Card>

                    <TemplateFooterCard footer={template.structure.footer} onFooterChanged={onFooterChanged} />
                </Form>

                <TemplateGroupModal
                    visible={questionGroupModal.visible}
                    name={questionGroupModal.name}
                    id={questionGroupModal.id}
                    onCancel={onGroupModalCancel}
                    onAdd={onGroupModalAdd}
                    onUpdate={onGroupModalUpdate}
                />
            </Col>
        </Row>
    );
};

export default StepDetailsInterview;

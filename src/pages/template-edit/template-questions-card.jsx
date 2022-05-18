import styles from "./template.module.css";
import { Button, Dropdown, Input, Menu, Space, Table, Tooltip } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import { cloneDeep, isEqual } from "lodash/lang";
import arrayMove from "array-move";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { CollapseIcon, ExpandIcon, ReorderIcon } from "../../components/utils/icons";
import { DeleteTwoTone, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "../../components/utils/date";
import { flatten, sortedUniq } from "lodash/array";
import { createTagColors } from "../../components/utils/constants";
import { TemplateTags } from "./template-tags";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";

const { TextArea } = Input;

/**
 *
 * @param {Template} template
 * @param {TemplateGroup} group
 * @param onGroupTitleClicked
 * @param onDeleteGroupClicked
 * @param onMoveGroupUpClicked
 * @param onMoveGroupDownClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateQuestionsCard = ({
    template,
    group,
    onGroupTitleClicked,
    onDeleteGroupClicked,
    onMoveGroupUpClicked,
    onMoveGroupDownClicked,
}) => {
    const [questions, setQuestions] = React.useState([]);
    const [tagColors, setTagsColors] = React.useState(new Map());
    const [questionsTags, setQuestionsTags] = React.useState([]);
    const [collapsed, setCollapsed] = React.useState(false);

    React.useEffect(() => {
        if (group.questions) {
            let questions = cloneDeep(group.questions);
            // question key and index required for drag & drop sorting
            questions.forEach((item, index) => {
                item.key = index;
                item.index = index;
            });
            setQuestions(questions);
            updateQuestionsTags();
        }
        // eslint-disable-next-line
    }, [group]);

    React.useEffect(() => {
        if(group) {
            // child component manages it`s own state to improve render performance + silently updates parent object
            group.questions = questions;
        }
        // eslint-disable-next-line
    }, [questions]);

    const updateQuestionsTags = () => {
        const tags = [];
        template.structure.groups.forEach(group => {
            group.questions.forEach(question => {
                tags.push(question.tags);
            });
        });
        const tagsFlat = flatten(tags).filter(tag => !isEmpty(tag));
        const tagColorsNew = createTagColors(tagsFlat);
        const questionsTagsNew = sortedUniq(tagsFlat.sort()).map(tag => ({ value: tag }));

        if (!isEqual(tagColors, tagColorsNew)) {
            setTagsColors(tagColorsNew);
        }

        if (!isEqual(questionsTags, questionsTagsNew)) {
            setQuestionsTags(questionsTagsNew);
        }
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedQuestions = arrayMove([].concat(questions), oldIndex, newIndex).filter(el => !!el);
            setQuestions(updatedQuestions);
        }
    };

    const SortableContainerQuestion = SortableContainer(props => <tbody {...props} />);

    const DraggableContainer = props => (
        <SortableContainerQuestion
            useDragHandle
            disableAutoscroll
            helperClass={styles.questionDragging}
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const SortableElementQuestion = SortableElement(props => <tr {...props} />);
    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = questions.findIndex(x => x.index === restProps["data-row-key"]);
        return <SortableElementQuestion index={index} {...restProps} />;
    };

    const DragHandle = SortableHandle(() => <ReorderIcon className={styles.reorderIcon} />);

    const onAddQuestionClicked = () => {
        const questionId = Date.now().toString();

        const newQuestion = {
            questionId: questionId,
            question: "",
            tags: [],
            key: questions.length - 1,
            index: questions.length - 1,
        };

        setQuestions([...questions, newQuestion]);
    };

    const onRemoveQuestionClicked = questionId => {
        setQuestions(questions.filter(q => q.questionId !== questionId));
    };

    const onQuestionChange = (questionId, question) => {
        // no need to update component state
        questions.find(q => q.questionId === questionId).question = question;
    };

    const onDifficultyChange = (questionId, difficulty) => {
        // no need to update component state
        questions.find(q => q.questionId === questionId).difficulty = difficulty;
    };

    const onTagsChange = (questionId, tags) => {
        // no need to update component state
        questions.find(q => q.questionId === questionId).tags = tags;

        updateQuestionsTags();
    };

    const onCollapseClicked = () => {
        setCollapsed(!collapsed);
    };

    const columns = [
        {
            width: 30,
            dataIndex: "sort",
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            key: "difficulty",
            width: 48,
            render: question => {
                return {
                    props: {
                        style: { padding: 0 },
                    },
                    children: (
                        <QuestionDifficultyTag
                            difficulty={question.difficulty}
                            onChange={difficulty => onDifficultyChange(question.questionId, difficulty)}
                            editable={true}
                        />
                    ),
                };
            },
        },
        {
            key: "question",
            className: styles.questionVisible,
            render: question => (
                <TextArea
                    className={styles.questionTextArea}
                    placeholder='Question'
                    bordered={false}
                    autoSize={true}
                    autoFocus={isEmpty(question.question)}
                    defaultValue={question.question}
                    onChange={e => onQuestionChange(question.questionId, e.target.value)}
                    onPressEnter={e => e.target.blur()}
                />
            ),
        },
        {
            key: "tags",
            width: 200,
            className: styles.tagsVisible,
            render: question => (
                <TemplateTags
                    question={question}
                    tagColors={tagColors}
                    questionsTags={questionsTags}
                    onTagsChange={onTagsChange}
                />
            ),
        },
        {
            key: "action",
            width: 24,
            className: styles.removeVisible,
            render: record => (
                <DeleteTwoTone
                    twoToneColor='red'
                    className={styles.removeIcon}
                    onClick={() => onRemoveQuestionClicked(record.questionId)}
                />
            ),
        },
    ];

    const menu = () => {
        const groups = template.structure.groups;
        const isFirst = groups.findIndex(g => g.groupId === group.groupId) === 0;
        const isLast = groups.findIndex(g => g.groupId === group.groupId) === groups.length - 1;
        return (
            <Menu>
                {!isFirst && <Menu.Item onClick={() => onMoveGroupUpClicked(group.groupId)}>Move Up</Menu.Item>}
                {!isLast && <Menu.Item onClick={() => onMoveGroupDownClicked(group.groupId)}>Move Down</Menu.Item>}
                <Menu.Divider />
                <Menu.Item onClick={() => onGroupTitleClicked(group.groupId, group.name)}>Rename</Menu.Item>
                <Menu.Item danger onClick={() => onDeleteGroupClicked(group.groupId)}>
                    Delete
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <div style={{ marginTop: 24 }}>
            <div className={styles.divSpaceBetween}>
                <Space>
                    <Text className={styles.groupTitle} onClick={() => onGroupTitleClicked(group.groupId, group.name)}>
                        {group.name}
                    </Text>
                    <Text type='secondary'>{group.questions.length} questions</Text>
                </Space>
                <Space>
                    {collapsed && (
                        <Tooltip title='Expand group'>
                            <ExpandIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                        </Tooltip>
                    )}
                    {!collapsed && (
                        <Tooltip title='Collapse group'>
                            <CollapseIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                        </Tooltip>
                    )}
                    <Dropdown overlay={menu}>
                        <MoreOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                    </Dropdown>
                </Space>
            </div>
            {!collapsed && (
                <div className={styles.questionsCard}>
                    <Table
                        pagination={false}
                        showHeader={false}
                        scroll={{
                            x: "max-content",
                        }}
                        dataSource={questions}
                        columns={columns}
                        rowKey='index'
                        components={{
                            body: {
                                wrapper: DraggableContainer,
                                row: DraggableBodyRow,
                            },
                        }}
                    />
                    <div className={styles.questionAddContainer}>
                        <Button type='link' onClick={() => onAddQuestionClicked(group.groupId)} icon={<PlusOutlined />}>
                            New question
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateQuestionsCard;

import styles from "./template.module.css";
import { Button, Dropdown, Input, Menu, Select, Space, Table, Tag, Tooltip } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import { cloneDeep } from "lodash/lang";
import arrayMove from "array-move";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { CollapseIcon, ExpandIcon, ReorderIcon } from "../../components/utils/icons";
import { DeleteTwoTone, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { defaultTo } from "lodash/util";
import { isEmpty } from "../../components/utils/utils";
import { flatten, sortedUniq } from "lodash/array";

/**
 *
 * @param {Template} template
 * @param {TemplateGroup} group
 * @param onQuestionsSortChange
 * @param onAddQuestionClicked
 * @param onRemoveQuestionClicked
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
    onQuestionsSortChange,
    onAddQuestionClicked,
    onRemoveQuestionClicked,
    onGroupTitleClicked,
    onDeleteGroupClicked,
    onMoveGroupUpClicked,
    onMoveGroupDownClicked
}) => {

    const [questions, setQuestions] = React.useState([])
    const [questionsTags, setQuestionsTags] = React.useState([])
    const [selectedTag, setSelectedTag] = React.useState()
    const [collapsed, setCollapsed] = React.useState(false)
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    React.useEffect(() => {
        if (group.questions) {
            let questions = cloneDeep(group.questions)
            // question key and index required for drag & drop sorting
            questions.forEach((item, index) => {
                item.key = index
                item.index = index
            })
            setQuestions(questions)
            updateQuestionsTags();
        }
        // eslint-disable-next-line
    }, [group]);

    function updateQuestionsTags() {
        const tags = []
        template.structure.groups.forEach(group => {
            group.questions.forEach(question => {
                tags.push(question.tags)
            })
        })
        setQuestionsTags(sortedUniq(flatten(tags).sort()).map(tag => ({ value: tag })))
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedQuestions = arrayMove([].concat(questions), oldIndex, newIndex).filter(el => !!el);
            setQuestions(updatedQuestions)
            onQuestionsSortChange(group.groupId, updatedQuestions);
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
        const index = questions.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableElementQuestion index={index} {...restProps} />;
    };

    const DragHandle = SortableHandle(() => (
        <ReorderIcon className={styles.reorderIcon} />
    ));

    const onTagClicked = (questionId) => {
        setSelectedTag(questionId)
    }

    const onTagLooseFocus = () => {
        setSelectedTag(null)
        forceUpdate()
    }

    const onQuestionChange = (questionId, question) => {
        // no need to propagate to parent to re-render
        questions.find(q => q.questionId === questionId).question = question
        group.questions.find(q => q.questionId === questionId).question = question
    }

    const onTagsChange = (questionId, tags) => {
        // no need to propagate to parent to re-render
        questions.find(q => q.questionId === questionId).tags = tags
        group.questions.find(q => q.questionId === questionId).tags = tags

        updateQuestionsTags()
    }

    const onCollapseClicked = () => {
        setCollapsed(!collapsed)
    }

    const columns = [
        {
            width: 30,
            dataIndex: 'sort',
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            key: 'question',
            className: styles.questionVisible,
            render: question => <Input
                placeholder="Question"
                size="small"
                bordered={false}
                autoFocus={isEmpty(question.question)}
                defaultValue={question.question}
                onChange={e => onQuestionChange(question.questionId, e.target.value)}
                onPressEnter={e => e.target.blur()}
            />
        },
        {
            key: 'tags',
            width: 250,
            className: styles.tagsVisible,
            render: question => (
                <>
                    {question.questionId !== selectedTag && defaultTo(question.tags, []).map(tag =>
                        (<Tag key={tag}
                              className={styles.clickableTag}
                              onClick={() => onTagClicked(question.questionId)}>
                            {tag.toLowerCase()}
                        </Tag>)
                    )}
                    {(question.questionId === selectedTag || isEmpty(question.tags)) &&
                    <Select mode="tags"
                            style={{ width: '100%' }}
                            onChange={tags => onTagsChange(question.questionId, tags)}
                            size="small"
                            autoFocus={!isEmpty(question.question) && question.questionId === selectedTag}
                            onBlur={onTagLooseFocus}
                            defaultValue={defaultTo(question.tags, [])}
                            placeholder="Tags"
                            options={questionsTags}
                    />}
                </>
            ),
        },
        {
            key: 'action',
            width: 24,
            className: styles.removeVisible,
            render: record => <DeleteTwoTone twoToneColor="red"
                                             className={styles.removeIcon}
                                             onClick={() => onRemoveQuestionClicked(record.questionId)} />
        }
    ];

    const menu = () => {
        const groups = template.structure.groups;
        const isFirst = groups.findIndex(g => g.groupId === group.groupId) === 0
        const isLast = groups.findIndex(g => g.groupId === group.groupId) === groups.length - 1
        return <Menu>
            {!isFirst && <Menu.Item onClick={() => onMoveGroupUpClicked(group.groupId)}>Move Up</Menu.Item>}
            {!isLast && <Menu.Item onClick={() => onMoveGroupDownClicked(group.groupId)}>Move Down</Menu.Item>}
            <Menu.Divider />
            <Menu.Item onClick={() => onGroupTitleClicked(group.groupId, group.name)}>Rename</Menu.Item>
            <Menu.Item danger onClick={() => onDeleteGroupClicked(group.groupId)}>Delete</Menu.Item>
        </Menu>
    }

    return <div style={{ marginTop: 24 }}>
        <div className={styles.divSpaceBetween}>
            <Space>
                <Text className={styles.groupTitle}
                      onClick={() => onGroupTitleClicked(group.groupId, group.name)}>{group.name}</Text>
                <Text type="secondary">{group.questions.length} questions</Text>
            </Space>
            <Space>
                {collapsed && <Tooltip title="Expand group">
                    <ExpandIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                </Tooltip>}
                {!collapsed && <Tooltip title="Collapse group">
                    <CollapseIcon onClick={onCollapseClicked} style={{ paddingRight: 8 }} />
                </Tooltip>}
                <Dropdown overlay={menu}>
                    <MoreOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                </Dropdown>
            </Space>
        </div>
        {!collapsed && <div className={styles.questionsCard}>
            <Table
                pagination={false}
                showHeader={false}
                dataSource={questions}
                columns={columns}
                rowKey="index"
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                    },
                }}
            />
            <div className={styles.questionAddContainer}>
                <Button type="link"
                        onClick={() => onAddQuestionClicked(group.groupId)}
                        icon={<PlusOutlined />}>New question</Button>
            </div>
        </div>}
    </div>
}

export default TemplateQuestionsCard
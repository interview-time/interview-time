import styles from "./template.module.css";
import { Button, Dropdown, Input, Menu, Space, Table, Tooltip } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import { SortableContainer, SortableElement, SortableHandle } from "react-sortable-hoc";
import { CollapseIcon, ExpandIcon, ReorderIcon } from "../../components/utils/icons";
import { DeleteTwoTone, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "../../components/utils/date";
import { TemplateTags } from "./template-tags";
import QuestionDifficultyTag from "../../components/tags/question-difficulty-tag";
import { isEqual } from "lodash";
import { log } from "../../components/utils/log";

const { TextArea } = Input;

/**
 *
 * @param {TemplateGroup} group
 * @param {boolean} isFirstGroup
 * @param {boolean} isLastGroup
 * @param {[]} allTags
 * @param onAddQuestionClicked
 * @param onRemoveQuestionClicked
 * @param onDifficultyChange
 * @param onQuestionSorted
 * @param onQuestionChange
 * @param onTagsChange
 * @param onGroupTitleClicked
 * @param onDeleteGroupClicked
 * @param onMoveGroupUpClicked
 * @param onMoveGroupDownClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateQuestionsCardInternal = ({
    group,
    isFirstGroup,
    isLastGroup,
    allTags,
    onAddQuestionClicked,
    onRemoveQuestionClicked,
    onDifficultyChange,
    onQuestionSorted,
    onQuestionChange,
    onTagsChange,
    onGroupTitleClicked,
    onDeleteGroupClicked,
    onMoveGroupUpClicked,
    onMoveGroupDownClicked,
}) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const templateTags = allTags.map(tag => ({
        value: tag,
        label: tag,
    }));

    group?.questions?.forEach((item, index) => {
        item.key = index;
        item.index = index;
    });

    const onSortEnd = ({ oldIndex, newIndex }) => {
        onQuestionSorted(group.groupId, oldIndex, newIndex);
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
        const index = group.questions.findIndex(question => question.index === restProps["data-row-key"]);
        return <SortableElementQuestion index={index} {...restProps} />;
    };

    const DragHandle = SortableHandle(() => <ReorderIcon className={styles.reorderIcon} />);

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
                            onChange={difficulty => onDifficultyChange(question, difficulty)}
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
                    onChange={e => onQuestionChange(question, e.target.value)}
                    onPressEnter={e => e.target.blur()}
                />
            ),
        },
        {
            key: "tags",
            width: 200,
            className: styles.tagsVisible,
            render: question => <TemplateTags question={question} allTags={templateTags} onTagsChange={onTagsChange} />,
        },
        {
            key: "action",
            width: 24,
            className: styles.removeVisible,
            render: record => (
                <DeleteTwoTone
                    twoToneColor='red'
                    className={styles.removeIcon}
                    onClick={() => onRemoveQuestionClicked(group.groupId, record.questionId)}
                />
            ),
        },
    ];

    const menu = () => {
        return (
            <Menu>
                {!isFirstGroup && <Menu.Item onClick={() => onMoveGroupUpClicked(group.groupId)}>Move Up</Menu.Item>}
                {!isLastGroup && <Menu.Item onClick={() => onMoveGroupDownClicked(group.groupId)}>Move Down</Menu.Item>}
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
                        dataSource={group.questions}
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

const areEqual = (prevProps, nextProps) => {
    const statesAreEqual = isEqual(prevProps.group, nextProps.group) && isEqual(prevProps.allTags, nextProps.allTags);
    log("TemplateQuestionsCard", nextProps.group.name, "state changed", !statesAreEqual);
    return statesAreEqual;
};

export const TemplateQuestionsCard = React.memo(TemplateQuestionsCardInternal, areEqual);

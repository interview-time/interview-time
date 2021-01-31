import React, { useState } from "react";
import styles from "./guide-question-group.module.css";
import { Card, Divider, Space, Table, Tag } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { DeleteTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import { ReorderIcon } from "../utils/icons";
import arrayMove from 'array-move';
import lang from "lodash/lang";
import { getDifficultyColor } from "../utils/constants";
import { defaultTo } from "lodash/util";

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const GuideQuestionGroupCard = ({ group, groupQuestions, onQuestionsSortChange, onRemoveQuestionClicked }) => {

    const [questions, setQuestions] = useState([])

    React.useEffect(() => {
        if (groupQuestions) {
            let questions = lang.cloneDeep(groupQuestions)
            // question key and index required for drag & drop sorting
            questions.forEach((item, index) => {
                item.key = index
                item.index = index
            })
            setQuestions(questions)
        }
    }, [groupQuestions]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            onQuestionsSortChange(arrayMove([].concat(questions), oldIndex, newIndex).filter(el => !!el));
        }
    };

    const DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass={styles.questionDragging}
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = questions.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const DragHandle = sortableHandle(() => (
        <ReorderIcon className={styles.reorderIcon} />
    ));

    const columns = [
        {
            title: 'Sort',
            dataIndex: 'sort',
            width: 30,
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            title: 'Question',
            dataIndex: 'question',
            className: styles.questionVisible,
            render: (text, question) => <div className={styles.questionWrapper}>
                <div className={styles.questionBody}>
                    <Space direction="vertical">
                        <Text>{question.question}</Text>
                        <div>
                            <Tag key={question.difficulty} color={getDifficultyColor(question.difficulty)}>
                                {question.difficulty}
                            </Tag>
                            {defaultTo(question.tags, []).map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                        </div>
                    </Space>
                </div>
                <DeleteTwoTone twoToneColor="red" className={styles.removeIcon}
                               onClick={() => onRemoveQuestionClicked(question)} />
            </div>
        }
    ];

    return (
        <Card bordered={false} className={styles.questionGroupCard} bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className={styles.cardHeader}>
                <Space direction="vertical" size={4}>
                    <Text strong>{group.name}</Text>
                    <Text>{questions.length} questions</Text>
                </Space>
            </div>
            <Divider className={styles.divider} />
            <Table
                pagination={false}
                showHeader={false}
                dataSource={questions}
                columns={columns}
                scroll={{ y: 700 }}
                rowKey="index"
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                    },
                }}
            />
        </Card>
    );
}

export default GuideQuestionGroupCard
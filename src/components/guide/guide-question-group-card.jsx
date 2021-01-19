import React, { useState } from "react";
import styles from "./guide-question-group-card.module.css";
import { Card, Divider, Space, Table, Tag } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { DeleteTwoTone } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import { ReorderIcon } from "../utils/icons";
import arrayMove from 'array-move';
import lang from "lodash/lang";

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

    const getTags = (question) => question.tags ? question.tags : []

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            onQuestionsSortChange(arrayMove([].concat(questions), oldIndex, newIndex).filter(el => !!el));
        }
    };

    const DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass={styles.rowDragging}
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
        <ReorderIcon style={{ cursor: 'pointer', fontSize: '20px' }} />
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
            className: styles.dragVisible,
            render: (text, question) => <div className={styles.questionWrapper}>
                <div className={styles.questionBody}>
                    <Space direction="vertical">
                        <Text>{question.question}</Text>
                        <div>
                            {getTags(question).map(tag => <Tag key={tag}>{tag.toLowerCase()}</Tag>)}
                        </div>
                    </Space>
                </div>
                <DeleteTwoTone twoToneColor="red" className={styles.removeIcon}
                               onClick={() => onRemoveQuestionClicked(question)} />
            </div>
        }
    ];

    return (
        <Card bordered={false} bodyStyle={{ paddingLeft: 0, paddingRight: 0, paddingTop: 32, paddingBottom: 32 }}>
            <Space style={{ paddingLeft: 24 }}>
                <Text strong>{group.name}</Text> <Text>{questions.length} questions</Text>
            </Space>
            <Divider style={{ marginBottom: 0 }} />
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
        </Card>
    );
}

export default GuideQuestionGroupCard
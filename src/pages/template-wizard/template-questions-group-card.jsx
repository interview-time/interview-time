import React from "react";
import styles from "./template-questions.module.css";
import { Button, Divider, Space, Table } from 'antd';
import Text from "antd/lib/typography/Text";
import { defaultTo } from "lodash/util";
import { DeleteTwoTone } from "@ant-design/icons";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { cloneDeep } from "lodash/lang";
import { ReorderIcon } from "../../components/utils/icons";
import arrayMove from "array-move";

const TemplateQuestionsGroupCard = ({ groupName, groupQuestions, onQuestionsSortChange, onRemoveQuestionClicked, onDoneClicked }) => {

    const [questions, setQuestions] = React.useState([])

    React.useEffect(() => {
        if (groupQuestions) {
            let questions = cloneDeep(groupQuestions)
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

    const columns = [
        {
            width: 30,
            dataIndex: 'sort',
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            title: 'Question',
            key: 'question',
            dataIndex: 'question',
            className: styles.questionVisible,
        },
        {
            key: 'action',
            width: 24,
            className: styles.removeVisible,
            render: record => <DeleteTwoTone twoToneColor="red"
                                             className={styles.removeIcon}
                                             onClick={() => onRemoveQuestionClicked(record)} />
        }
    ];

    return (
        <div className={styles.cardContainerCompetenceArea}>
            <div className={styles.cardHeaderSticky}>
                <Space direction="vertical" size={4}>
                    <Text strong>{groupName}</Text>
                    <Text>{defaultTo(questions, []).length} questions</Text>
                </Space>
                <Button type="primary" onClick={onDoneClicked}>Done</Button>
            </div>
            <Divider className={styles.divider} />
            <div className={styles.table}>
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
            </div>
        </div>
    );
}

export default TemplateQuestionsGroupCard
import styles from "./live-coding-assessment-card.module.css";
import Card from "../../../../components/card/card";
import React from "react";
import { TemplateGroup, TemplateQuestion } from "../../../../store/models";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { Button, ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SortableContainer, SortableElement, SortableHandle, SortEnd } from "react-sortable-hoc";
import { ReorderIcon } from "../../../../utils/icons";
import { PlusOutlined } from "@ant-design/icons";
import AssessmentCheckbox, { MAX_ASSESSMENT } from "../../../../components/questions/assessment-checkbox";
import AssessmentImage from "../../../../assets/illustrations/undraw_up_to_date_re_nqid.svg";

type Props = {
    group: Readonly<TemplateGroup>;
    onAddAssessmentClicked: () => void;
    onUpdateQuestionClicked: (question: TemplateQuestion) => void;
    onQuestionSorted: (groupId: string, oldIndex: number, newIndex: number) => void;
};

const LiveCodingAssessmentCard = ({
    group,
    onAddAssessmentClicked,
    onUpdateQuestionClicked,
    onQuestionSorted,
}: Props) => {
    group.questions.forEach((question, index) => {
        // @ts-ignore
        question.key = index;
        // @ts-ignore
        question.index = index;
    });

    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => onQuestionSorted(group.groupId, oldIndex, newIndex);

    const SortableContainerQuestion = SortableContainer((props: any) => <tbody {...props} />);

    const DraggableContainer = (props: any) => (
        <SortableContainerQuestion
            useDragHandle
            disableAutoscroll
            helperClass={styles.questionDragging}
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const SortableElementQuestion = SortableElement((props: any) => <tr className={styles.row} {...props} />);

    // @ts-ignore
    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        // @ts-ignore
        const index = group.questions.findIndex(question => question.index === restProps["data-row-key"]);
        return <SortableElementQuestion index={index} {...restProps} />;
    };

    const DragHandle = SortableHandle(() => <ReorderIcon className={styles.reorderIcon} />);

    let columns: ColumnsType<TemplateQuestion> = [
        {
            width: 30,
            dataIndex: "sort",
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            key: "question",
            className: styles.questionVisible,
            render: question => <Text>{question.question}</Text>,
        },
        {
            key: "assessment",
            width: 120,
            className: styles.assessmentVisible,
            render: () => (
                // @ts-ignore
                <AssessmentCheckbox defaultValue={MAX_ASSESSMENT} disabled={true} hideNoAssessment={true} />
            ),
        },
    ];

    return (
        <Card>
            <Title level={4}>{group.name}</Title>
            <Text type='secondary'>Define several code assessment criteria.</Text>
            <div className={styles.questionsCard}>
                <ConfigProvider
                    renderEmpty={() => (
                        <img src={AssessmentImage} alt='Assessment' className={styles.assessmentsImage} />
                    )}
                >
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
                        rowClassName={styles.row}
                        onRow={record => {
                            return {
                                onClick: () => {
                                    onUpdateQuestionClicked(record);
                                },
                            };
                        }}
                    />
                </ConfigProvider>
            </div>

            <Button
                style={{ marginTop: 12 }}
                icon={<PlusOutlined />}
                type='primary'
                ghost
                onClick={onAddAssessmentClicked}
            >
                New assessment
            </Button>
        </Card>
    );
};

export default LiveCodingAssessmentCard;

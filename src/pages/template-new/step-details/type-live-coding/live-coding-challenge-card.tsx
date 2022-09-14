import styles from "./live-coding-assessment-card.module.css";
import Card from "../../../../components/card/card";
import React from "react";
import { Challenge } from "../../../../store/models";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import { Button, ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SortableContainer, SortableElement, SortableHandle, SortEnd } from "react-sortable-hoc";
import { ReorderIcon } from "../../../../utils/icons";
import { PlusOutlined } from "@ant-design/icons";
import TaskImage from "../../../../assets/illustrations/undraw_code_review_re_woeb.svg";
import {
    FileChallengeIcon,
    GithubChallengeIcon
} from "../../../../components/scorecard/type-live-coding/challenge-card";

type Props = {
    challenges: Readonly<Challenge[]>;
    onNewChallengeClicked: () => void;
    onUpdateChallengeClicked: (challenge: Challenge) => void;
    onChallengeSorted: (oldIndex: number, newIndex: number) => void;
};

const LiveCodingChallengeCard = ({
    challenges,
    onNewChallengeClicked,
    onUpdateChallengeClicked,
    onChallengeSorted,
}: Props) => {
    challenges.forEach((challenge, index) => {
        // @ts-ignore
        challenge.key = index;
        // @ts-ignore
        challenge.index = index;
    });

    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        onChallengeSorted(oldIndex, newIndex);
    };

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
        const index = challenges.findIndex(challenge => challenge.index === restProps["data-row-key"]);
        return <SortableElementQuestion index={index} {...restProps} />;
    };

    const DragHandle = SortableHandle(() => <ReorderIcon className={styles.reorderIcon} />);

    let columns: ColumnsType<Challenge> = [
        {
            width: 30,
            dataIndex: "sort",
            className: styles.dragVisible,
            render: () => <DragHandle />,
        },
        {
            key: "challenge",
            className: styles.questionVisible,
            render: (challenge: Challenge) => <Text>{challenge.name}</Text>,
        },
        {
            key: "assessment",
            width: 24,
            className: styles.taskIconVisible,
            render: (challenge: Challenge) => (
                <>
                    {challenge.gitHubUrl && <GithubChallengeIcon />}
                    {challenge.fileName && <FileChallengeIcon />}
                </>
            ),
        },
    ];

    return (
        <Card className={styles.cardSpace}>
            <Title level={4}>Task</Title>
            <Text type='secondary'>Add one or multiple tasks to use during the interview.</Text>
            <div className={styles.questionsCard}>
                <ConfigProvider
                    renderEmpty={() => <img src={TaskImage} alt='Task' className={styles.assessmentsImage} />}
                >
                    <Table
                        pagination={false}
                        showHeader={false}
                        scroll={{
                            x: "max-content",
                        }}
                        dataSource={challenges}
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
                                    onUpdateChallengeClicked(record);
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
                onClick={onNewChallengeClicked}
            >
                New task
            </Button>
        </Card>
    );
};

export default LiveCodingChallengeCard;

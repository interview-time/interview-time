import { CardOutlined, Tag, TagSlim } from "../../assets/styles/global-styles";
import { Job, JobStatus } from "../../store/models";
import { Button, Col, Dropdown, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { AccentColors, Colors } from "../../assets/styles/colors";
import { getFormattedDateShort } from "../../utils/date-fns";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { getTagColor, getTagTextColor } from "../../utils/colors";

const { Text } = Typography;

const JobCardOutlined = styled(CardOutlined)`
    min-height: 84px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;

    &:hover {
        border-color: ${Colors.Primary_500};
    }
`;

const CardRow = styled(Row)`
    align-items: center;
    width: 100%;
`;

const JobTitle = styled(Text)`
    font-weight: 600;
`;

const JobLocation = styled(Text)`
    font-size: 14px;
    color: ${Colors.Neutral_500};
`;

const ActionsButton = styled(Button)`
    && {
        width: 36px;
        height: 36px;
    }
`;

const ActionsCol = styled(Col)`
    display: flex;
    justify-content: flex-end;
`;

const ClosedIndicator = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: ${AccentColors.Red_500};
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

type Props = {
    job: Job;
    onCardClicked: (job: Job) => void;
    onEditClicked: (job: Job) => void;
};

const JobCard = ({ job, onCardClicked, onEditClicked }: Props) => {
    const actionsMenu: ItemType[] = [
        {
            key: "edit",
            label: "Edit",
            onClick: e => {
                e.domEvent.stopPropagation();
                onEditClicked(job);
            },
        },
    ];

    return (
        <JobCardOutlined onClick={() => onCardClicked(job)}>
            <CardRow gutter={[6, 6]}>
                <Col xs={12} lg={8}>
                    <Space direction='vertical' size={4}>
                        <TitleContainer>
                            <JobTitle>{job.title}</JobTitle>
                            {job.status === JobStatus.CLOSED && <ClosedIndicator />}
                        </TitleContainer>
                        <JobLocation>{job.location}</JobLocation>
                    </Space>
                </Col>

                <Col xs={12} lg={4}>
                    <Tag textColor={getTagTextColor(job.department)} backgroundColor={getTagColor(job.department)}>
                        {job.department}
                    </Tag>
                </Col>

                <Col xs={12} lg={6}>
                    <Space size={6}>
                        <Text>{job.totalCandidates} candidates</Text>
                        {job.newlyAddedCandidates > 0 && (
                            <TagSlim textColor={Colors.Primary_500} backgroundColor={Colors.Primary_50}>
                                +{job.newlyAddedCandidates}
                            </TagSlim>
                        )}
                    </Space>
                </Col>

                <Col xs={10} lg={4}>
                    <Text>{getFormattedDateShort(job.createdDate)}</Text>
                </Col>

                <ActionsCol xs={2} lg={2}>
                    <Dropdown
                        menu={{
                            items: actionsMenu,
                        }}
                    >
                        <ActionsButton icon={<MoreHorizontal size={16} />} onClick={e => e.stopPropagation()} />
                    </Dropdown>
                </ActionsCol>
            </CardRow>
        </JobCardOutlined>
    );
};

export default JobCard;

import { CardOutlined } from "../../assets/styles/global-styles";
import { Job } from "../../store/models";
import { Button, Col, Dropdown, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { getFormattedDateShort } from "../../utils/date-fns";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { Link } from "react-router-dom";
import { routeJobEdit } from "../../utils/route";

const { Text } = Typography;

const StyledCard = styled(CardOutlined)`
    min-height: 84px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
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

const NewCandidatesTag = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${Colors.Primary_500};
    background: ${Colors.Primary_50};
    padding: 2px 8px;
`;

const DepartmentTag = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${Colors.Success_700};
    background: ${Colors.Success_50};
    padding: 4px 12px;
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

type Props = {
    job: Job;
    onClick: (job: Job) => void;
};

const JobCard = ({ job, onClick }: Props) => {
    const actionsMenu: ItemType[] = [
        {
            key: "1",
            label: <Link to={routeJobEdit(job.jobId)}>Edit</Link>,
        },
    ];

    return (
        <StyledCard onClick={() => onClick(job)}>
            <CardRow gutter={[6, 6]}>
                <Col xs={12} lg={8}>
                    <Space direction='vertical' size={4}>
                        <JobTitle>{job.title}</JobTitle>
                        <JobLocation>{job.location}</JobLocation>
                    </Space>
                </Col>

                <Col xs={12} lg={4}>
                    <DepartmentTag>{job.department}</DepartmentTag>
                </Col>

                <Col xs={12} lg={6}>
                    <Space size={6}>
                        <Text>{job.totalCandidates} candidates</Text>
                        {job.newlyAddedCandidates > 0 && (
                            <NewCandidatesTag>+{job.newlyAddedCandidates}</NewCandidatesTag>
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
        </StyledCard>
    );
};

export default JobCard;

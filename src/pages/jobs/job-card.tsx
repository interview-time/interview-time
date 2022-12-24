import { CardOutlined } from "../../assets/styles/global-styles";
import { Job } from "../../store/models";
import { Button, Col, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { getFormattedDateShort } from "../../utils/date-fns";
import { MoreHorizontal } from "lucide-react";
import React from "react";

const { Text } = Typography;

type Props = {
    job: Job;
};

const StyledCard = styled(CardOutlined)`
    min-height: 84px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    width: 100%;
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

const JobCard = ({ job }: Props) => {
    return (
        <StyledCard>
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
                    <ActionsButton icon={<MoreHorizontal size={16} />} onClick={e => e.stopPropagation()} />
                </ActionsCol>
            </CardRow>
        </StyledCard>
    );
};

export default JobCard;

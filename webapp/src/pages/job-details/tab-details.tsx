import { JobDetails } from "../../store/models";
import { Avatar, Button, Col, Dropdown, Modal, Row, Space, Typography } from "antd";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { getInitials } from "../../utils/string";
import React from "react";
import { Calendar, CalendarX, Edit3, MapPin, MoreHorizontal, Network } from "lucide-react";
import { SecondaryTextSmall, Tag, TextExtraBold } from "../../assets/styles/global-styles";
import { getFormattedDate } from "../../utils/date-fns";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ItemType } from "antd/es/menu/hooks/useItems";

const { Title, Text } = Typography;

const Header = styled.div`
    background: ${Colors.Neutral_50};
    border-radius: 12px 12px 0 0;
    padding: 32px;
`;

const HeaderTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ItemTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ItemContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

const ItemIconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: ${Colors.Neutral_50};
    color: ${Colors.Neutral_500};
`;

const OwnerAvatar = styled(Avatar)`
    color: ${Colors.Primary_500};
    background-color: ${Colors.Primary_50};
    vertical-align: middle;
    font-weight: 600;
`;

const Label = styled(SecondaryTextSmall)`
    font-weight: 500;
`;

const MetaRow = styled(Row)`
    margin-top: 64px;
    margin-left: 32px;
    gap: 32px;
`;

const TagsHolder = styled.div`
    display: flex;
    gap: 8px;
`;

type Props = {
    job: JobDetails;
    onEditJob: () => void;
    onRemoveJob: () => void;
};

const TabDetails = ({ job, onEditJob, onRemoveJob }: Props) => {
    const showDeleteDialog = () => {
        Modal.confirm({
            title: "Remove job",
            content: `Are you sure you want to remove this job?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                onRemoveJob();
            },
        });
    };

    const createActionsMenu = (): ItemType[] => [
        {
            key: "remove",
            label: "Remove",
            danger: true,
            onClick: e => {
                e.domEvent.stopPropagation();
                showDeleteDialog();
            },
        },
    ];

    const getHeader = () => (
        <Header>
            <HeaderTitleContainer>
                <Title level={3}>{job.title}</Title>
                <Space size={12}>
                    <Button
                        icon={
                            <AntIconSpan>
                                <Edit3 size='1em' />
                            </AntIconSpan>
                        }
                        onClick={onEditJob}
                    />
                    <Dropdown
                        menu={{
                            items: createActionsMenu(),
                        }}
                    >
                        <Button
                            icon={
                                <AntIconSpan>
                                    <MoreHorizontal size='1em' />
                                </AntIconSpan>
                            }
                        />
                    </Dropdown>
                </Space>
            </HeaderTitleContainer>

            <ItemContainer>
                <OwnerAvatar size={48}>{getInitials(job.ownerName)}</OwnerAvatar>
                <ItemTextContainer>
                    <TextExtraBold>{job.ownerName}</TextExtraBold>
                    <Label>Job owner</Label>
                </ItemTextContainer>
            </ItemContainer>
        </Header>
    );

    return (
        <Row>
            <Col span={24} xl={{ span: 16, offset: 4 }}>
                {getHeader()}
                {(job.location || job.department) && (
                    <MetaRow>
                        {job.location && (
                            <Col span={24} md={{ span: 8 }}>
                                <ItemContainer>
                                    <ItemIconContainer>
                                        <MapPin />
                                    </ItemIconContainer>
                                    <ItemTextContainer>
                                        <TextExtraBold>{job.location}</TextExtraBold>
                                        <Label>Location</Label>
                                    </ItemTextContainer>
                                </ItemContainer>
                            </Col>
                        )}
                        {job.department && (
                            <Col span={24} md={{ span: 8 }}>
                                <ItemContainer>
                                    <ItemIconContainer>
                                        <Network />
                                    </ItemIconContainer>
                                    <ItemTextContainer>
                                        <TextExtraBold>{job.department}</TextExtraBold>
                                        <Label>Department</Label>
                                    </ItemTextContainer>
                                </ItemContainer>
                            </Col>
                        )}
                    </MetaRow>
                )}
                <MetaRow>
                    <Col span={24} md={{ span: 8 }}>
                        <ItemContainer>
                            <ItemIconContainer>
                                <Calendar />
                            </ItemIconContainer>
                            <ItemTextContainer>
                                <TextExtraBold>{getFormattedDate(job.createdDate)}</TextExtraBold>
                                <Label>Created</Label>
                            </ItemTextContainer>
                        </ItemContainer>
                    </Col>
                    {job.deadline && (
                        <Col span={24} md={{ span: 8 }}>
                            <ItemContainer>
                                <ItemIconContainer>
                                    <CalendarX />
                                </ItemIconContainer>
                                <ItemTextContainer>
                                    <TextExtraBold>{getFormattedDate(job.createdDate)}</TextExtraBold>
                                    <Label>Deadline</Label>
                                </ItemTextContainer>
                            </ItemContainer>
                        </Col>
                    )}
                </MetaRow>
                {job.description && (
                    <MetaRow>
                        <Col span={24} md={{ span: 8 }}>
                            <Title level={4}>Description</Title>
                        </Col>
                        <Col span={24} md={{ span: 14 }}>
                            <Text>{job.description}</Text>
                        </Col>
                    </MetaRow>
                )}
                {job.tags && job.tags.length > 0 && (
                    <MetaRow>
                        <Col span={24} md={{ span: 8 }}>
                            <Title level={4}>Tags</Title>
                        </Col>
                        <Col span={24} md={{ span: 14 }}>
                            <TagsHolder>
                                {job.tags.map(tag => (
                                    <Tag key={tag}>{tag}</Tag>
                                ))}
                            </TagsHolder>
                        </Col>
                    </MetaRow>
                )}
            </Col>
        </Row>
    );
};

export default TabDetails;

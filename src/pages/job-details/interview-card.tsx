import { Avatar, Col, Dropdown, Row, Typography } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { MoreVertical } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { AccentColors, Colors } from "../../assets/styles/colors";
import { Card, SecondaryText, TextBold } from "../../assets/styles/global-styles";
import InitialsAvatar from "../../components/avatar/initials-avatar";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { LinkedInterviews } from "../../store/interviews/selector";
import { Interview, TeamMember } from "../../store/models";
import { Status } from "../../utils/constants";
import { formatDate, getFormattedTimeRange } from "../../utils/date-fns";
import { interviewWithoutDate, NO_DATE_LABEL } from "../../utils/interview";

const { Text } = Typography;

const InterviewCardOutlined = styled(Card)`
    min-height: 116px;
    display: flex;
    align-items: center;
    width: 100%;
`;

type CardStartContainerProps = {
    color: string;
};

const FlexCol = styled(Col)`
    display: flex;
`;

const FlexEndCol = styled(Col)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CardStartContainer = styled.div`
    min-height: 116px;
    width: 6px;
    background-color: ${(props: CardStartContainerProps) => props.color};
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
`;

const CardEndContainer = styled.div`
    min-height: 116px;
`;

const IconContainer = styled.div`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    margin-top: 16px;
    cursor: pointer;
`;

const CardRow = styled(Row)`
    align-items: center;
    width: 100%;
`;

const DateJobContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    margin-left: 32px;
`;
const DateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 64px;
`;

const JobContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const DayText = styled(Text)`
    font-weight: 600;
    font-size: 32px;
    line-height: 32px;
`;

type Props = {
    linkedInterviews: LinkedInterviews;
    teamMembers: TeamMember[];
    onDeleteInterviewClicked?: (interview: Interview) => void;
};

const InterviewCard = ({ linkedInterviews, teamMembers, onDeleteInterviewClicked }: Props) => {
    const interview = linkedInterviews.interviews[0];
    const interviewers = interview.interviewers.map(
        interviewerId => teamMembers.find(teamMember => teamMember.userId === interviewerId)?.name || "Unknown"
    );

    const actionsMenu = (interview: Interview): ItemType[] => {
        const items: ItemType[] = [];
        if (interview.status !== Status.SUBMITTED && interview.status !== Status.COMPLETED) {
            items.push({
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: e => {
                    e.domEvent.stopPropagation();
                    onDeleteInterviewClicked?.(interview);
                },
            });
        }
        return items;
    };

    const getCardColor = () =>
        new Date() > interview.parsedStartDateTime ? AccentColors.Orange_500 : Colors.Neutral_200;

    return (
        <InterviewCardOutlined>
            <CardRow gutter={[6, 6]}>
                <FlexCol span={12}>
                    <CardStartContainer color={getCardColor()} />
                    <DateJobContainer>
                        <DateContainer>
                            <DayText>
                                {interviewWithoutDate(interview)
                                    ? NO_DATE_LABEL
                                    : formatDate(interview.parsedStartDateTime, "dd")}
                            </DayText>
                            {!interviewWithoutDate(interview) && (
                                <TextBold>{formatDate(interview.parsedStartDateTime, "LLL")}</TextBold>
                            )}
                        </DateContainer>
                        <JobContainer>
                            {!interviewWithoutDate(interview) && (
                                <SecondaryText>
                                    {getFormattedTimeRange(interview.parsedStartDateTime, interview.parsedEndDateTime)}
                                </SecondaryText>
                            )}
                            <TextBold>{interview.candidate}</TextBold>
                        </JobContainer>
                    </DateJobContainer>
                </FlexCol>
                <Col span={4}>
                    <Avatar.Group>
                        {interviewers.map(interviewer => (
                            <InitialsAvatar interviewerName={interviewer} />
                        ))}
                    </Avatar.Group>
                </Col>
                <Col span={4}>
                    <SecondaryText>{interview.stageTitle || "-"}</SecondaryText>
                </Col>
                <FlexEndCol span={4}>
                    <InterviewStatusTag
                        interviewStartDateTime={interview.parsedStartDateTime}
                        status={interview.status}
                    />
                    {onDeleteInterviewClicked && (
                        <CardEndContainer>
                            <Dropdown
                                menu={{
                                    items: actionsMenu(interview),
                                }}
                                placement='bottomLeft'
                            >
                                <IconContainer>
                                    <MoreVertical size={20} />
                                </IconContainer>
                            </Dropdown>
                        </CardEndContainer>
                    )}
                </FlexEndCol>
            </CardRow>
        </InterviewCardOutlined>
    );
};

export default InterviewCard;

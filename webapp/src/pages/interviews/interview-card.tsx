import { Col, Dropdown, Row, Typography } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { MoreVertical } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { AccentColors, Colors } from "../../assets/styles/colors";
import { CardClickable, FormLabelSmall, SecondaryText, TextBold } from "../../assets/styles/global-styles";
import InitialsAvatar from "../../components/avatar/initials-avatar";
import DemoTag from "../../components/demo/demo-tag";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import { Interview, InterviewStatus } from "../../store/models";
import { formatDate, getFormattedTimeRange } from "../../utils/date-fns";
import { interviewWithoutDate, NO_DATE_LABEL } from "../../utils/interview";

const { Text } = Typography;

const InterviewCardOutlined = styled(CardClickable)`
    min-height: 116px;
    display: flex;
    align-items: center;
    width: 100%;
`;

type CardStartContainerProps = {
    color: string;
};

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
`;

const CardRow = styled(Row)`
    align-items: center;
    width: 100%;
`;

const FlexEndCol = styled(Col)`
    display: flex;
    align-items: center;
    justify-content: space-between;
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

const CandidateContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const DayText = styled(Text)`
    font-weight: 600;
    font-size: 32px;
    line-height: 32px;
`;

type Props = {
    interview: Interview;
    onInterviewClicked: (interview: Interview) => void;
    onCancelInterviewClicked?: (interview: Interview) => void;
};

const InterviewCard = ({ interview, onInterviewClicked, onCancelInterviewClicked }: Props) => {
    const isInterviewCancellable =
        interview.status !== InterviewStatus.CANCELLED &&
        interview.status !== InterviewStatus.SUBMITTED &&
        onCancelInterviewClicked;

    const actionsMenu = (interview: Interview): ItemType[] => [
        {
            key: "cancel",
            label: "Cancel interview",
            danger: true,
            onClick: e => {
                e.domEvent.stopPropagation();
                onCancelInterviewClicked?.(interview);
            },
        },
    ];

    const getCardColor = () => {
        if (interview.status === InterviewStatus.CANCELLED) {
            return AccentColors.Red_500;
        } else if (new Date() > interview.parsedStartDateTime) {
            return AccentColors.Orange_500;
        } else {
            return Colors.Neutral_200;
        }
    };

    return (
        <InterviewCardOutlined
            onClick={() => {
                if (interview.status !== InterviewStatus.CANCELLED) {
                    onInterviewClicked(interview);
                }
            }}
        >
            <CardStartContainer color={getCardColor()} />
            <CardRow gutter={[6, 6]}>
                <Col xs={12} lg={8}>
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
                            <TextBold>{interview.position || "-"}</TextBold>
                        </JobContainer>
                    </DateJobContainer>
                </Col>
                <Col xs={12} lg={6}>
                    <CandidateContainer>
                        <InitialsAvatar interviewerName={interview.candidate ?? "-"} />
                        <FormLabelSmall className='fs-mask'>{interview.candidate ?? "Unknown"}</FormLabelSmall>
                        <DemoTag isDemo={interview.isDemo} />
                    </CandidateContainer>
                </Col>
                <FlexEndCol xs={12} lg={5}>
                    <InterviewStatusTag
                        interviewStartDateTime={interview.parsedStartDateTime}
                        status={interview.status}
                    />
                    {isInterviewCancellable && (
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

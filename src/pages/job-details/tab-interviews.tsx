import { Col, ConfigProvider, List, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import EmptyState from "../../components/empty-state/empty-state";
import { loadInterviews } from "../../store/interviews/actions";
import { LinkedInterviews, selectUncompletedJobInterviews } from "../../store/interviews/selector";
import { Interview, JobDetails, TeamMember, UserProfile } from "../../store/models";
import { loadTeam } from "../../store/team/actions";
import { selectTeamMembers } from "../../store/team/selector";
import { selectUserProfile } from "../../store/user/selector";
import InterviewCard from "./interview-card";
import CancelInterviewModal from "../interview-schedule/cancel-interview-modal";

const { Text } = Typography;

const InterviewsContainer = styled.div`
    padding: 24px 24px 16px;
    background-color: ${Colors.Neutral_50};
    border-radius: 6px;
    min-width: 800px;
    overflow: scroll;
`;

const CardRow = styled(Row)`
    align-items: center;
    width: 100%;
    margin-bottom: 24px;
`;

const TableHeaderText = styled(Text)`
    color: ${Colors.Neutral_500};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
`;

type CancelInterviewModalProps = {
    visible: boolean;
    interviewId?: string;
    candidateName?: string;
};

type Props = {
    jobDetails: JobDetails | undefined;
    onInterviewRemoved: () => void;
};

const TabInterviews = ({ jobDetails, onInterviewRemoved }: Props) => {
    const dispatch = useDispatch();

    const [cancelInterviewModal, setCancelInterviewModal] = useState<CancelInterviewModalProps>({
        interviewId: "",
        visible: false,
    });

    const uncompletedInterviews: LinkedInterviews[] = useSelector(
        selectUncompletedJobInterviews(jobDetails?.jobId || ""),
        shallowEqual
    );
    const teamMembers: TeamMember[] = useSelector(selectTeamMembers, shallowEqual);
    const profile: UserProfile = useSelector(selectUserProfile, shallowEqual);

    useEffect(() => {
        dispatch(loadInterviews(true));

        if (teamMembers.length === 0) {
            dispatch(loadTeam(profile.currentTeamId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobDetails]);

    const showCancelDialog = (interview: Interview) =>
        setCancelInterviewModal({
            visible: true,
            interviewId: interview.interviewId,
            candidateName: interview.candidate,
        });

    return (
        <InterviewsContainer>
            {uncompletedInterviews.length > 0 && (
                <CardRow gutter={[6, 6]}>
                    <Col span={12}>
                        <TableHeaderText>CANDIDATE</TableHeaderText>
                    </Col>
                    <Col span={4}>
                        <TableHeaderText>INTERVIEWER</TableHeaderText>
                    </Col>
                    <Col span={4}>
                        <TableHeaderText>STAGE</TableHeaderText>
                    </Col>
                    <Col span={4}>
                        <TableHeaderText>STATUS</TableHeaderText>
                    </Col>
                </CardRow>
            )}
            <ConfigProvider renderEmpty={() => <EmptyState message='There are no scheduled interviews for this job' />}>
                <List
                    grid={{ gutter: 32, column: 1 }}
                    split={false}
                    dataSource={uncompletedInterviews}
                    renderItem={(linkedInterviews: LinkedInterviews) => (
                        <List.Item>
                            <InterviewCard
                                linkedInterviews={linkedInterviews}
                                teamMembers={teamMembers}
                                onCancelInterviewClicked={showCancelDialog}
                            />
                        </List.Item>
                    )}
                />
            </ConfigProvider>
            <CancelInterviewModal
                open={cancelInterviewModal.visible}
                interviewId={cancelInterviewModal.interviewId}
                candidateName={cancelInterviewModal.candidateName}
                onClose={(interviewRemoved?: boolean) => {
                    setCancelInterviewModal({
                        visible: false,
                        candidateName: undefined,
                        interviewId: undefined,
                    });
                    if (interviewRemoved) {
                        onInterviewRemoved();
                    }
                }}
            />
        </InterviewsContainer>
    );
};

export default TabInterviews;

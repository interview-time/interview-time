import { Button, Spin, Tabs, Typography } from "antd";
import { isEmpty } from "lodash";
import { CalendarCheck, CalendarDays, Plus, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AccentColors } from "../../assets/styles/colors";
import { Card, SecondaryTextSmall, TextBold } from "../../assets/styles/global-styles";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import Layout from "../../components/layout/layout";
import { Header, HeaderContainer, HeaderSearch } from "../../components/layout/layout-header";
import { loadCandidates } from "../../store/candidates/actions";
import { loadInterviews } from "../../store/interviews/actions";
import {
    selectCompletedInterviews,
    selectGetInterviewsStatus,
    selectUncompletedUserInterviews,
} from "../../store/interviews/selector";
import { Interview, TeamMember, UserProfile } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { loadTeam } from "../../store/team/actions";
import { selectTeamMembers } from "../../store/team/selector";
import { selectUserProfile } from "../../store/user/selector";
import { hexToRgb } from "../../utils/colors";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";
import TabInterviews from "./tab-interviews";
import TabReports from "./tab-reports";

const { Title } = Typography;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
`;

const InterviewMetaContainer = styled.div`
    display: flex;
    gap: 32px;
    margin-bottom: 16px;
`;

const InterviewMetaCard = styled(Card)`
    width: 280px;
    padding: 16px;
    gap: 16px;
    display: flex;
    align-items: center;
`;

const IconContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const IconContainerBlue = styled(IconContainer)`
    background-color: ${hexToRgb(AccentColors.Blue_500, 0.1)};
`;

const IconContainerGreen = styled(IconContainer)`
    background-color: ${hexToRgb(AccentColors.Green_500, 0.1)};
`;

const IconContainerYellow = styled(IconContainer)`
    background-color: ${hexToRgb(AccentColors.Orange_500, 0.1)};
`;

const Interviews = () => {
    const dispatch = useDispatch();

    const profile: UserProfile = useSelector(selectUserProfile, shallowEqual);
    const uncompletedInterviews: Interview[] = useSelector(selectUncompletedUserInterviews, shallowEqual);
    const completedInterviews: Interview[] = useSelector(selectCompletedInterviews, shallowEqual);
    const teamMembers: TeamMember[] = useSelector(selectTeamMembers, shallowEqual);

    const getInterviewsStatus: ApiRequestStatus = useSelector(selectGetInterviewsStatus, shallowEqual);
    const interviewsLoading = getInterviewsStatus === ApiRequestStatus.InProgress;

    const currentDate = new Date();
    const completedInterviewsThisYear = completedInterviews.filter(
        interview => interview.parsedStartDateTime.getFullYear() === currentDate.getFullYear()
    );
    const completedInterviewsThisMonth = completedInterviewsThisYear.filter(
        interview => interview.parsedStartDateTime.getMonth() === currentDate.getMonth()
    );

    const [interviewModalVisible, setInterviewModalVisible] = useState(false);

    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        if (!interviewsLoading) {
            dispatch(loadInterviews(true));
        }
        dispatch(loadCandidates());
        dispatch(loadTeam(profile.currentTeamId));
        // eslint-disable-next-line
    }, []);

    const onScheduleInterview = () => setInterviewModalVisible(true);

    const onSearchTextChange = (text: string) => setFilter(text);

    const applyFilter = (interviews: Interview[]) => {
        if (isEmpty(filter)) {
            return interviews;
        }
        const filterLowerCased = filter.toLowerCase();
        return interviews.filter(
            interview =>
                interview.candidate?.toLowerCase().includes(filterLowerCased) ||
                interview.jobTitle?.toLowerCase().includes(filterLowerCased) ||
                interview.stageTitle?.toLowerCase().includes(filterLowerCased)
        );
    };

    const getHeaderContainer = (
        <HeaderContainer>
            <Header>
                <HeaderSearch
                    placeholder='Search for interview'
                    defaultValue={filter}
                    onSearchTextChange={onSearchTextChange}
                />
                <Button
                    type='primary'
                    icon={
                        <AntIconSpan>
                            <Plus size='1em' />
                        </AntIconSpan>
                    }
                    onClick={onScheduleInterview}
                >
                    Schedule interview
                </Button>
            </Header>
        </HeaderContainer>
    );

    return (
        <Layout header={getHeaderContainer}>
            <TitleContainer>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Interviews
                </Title>
                <Spin spinning={interviewsLoading} />
            </TitleContainer>

            <InterviewMetaContainer>
                <InterviewMetaCard>
                    <IconContainerBlue>
                        <CalendarDays color={AccentColors.Blue_500} />
                    </IconContainerBlue>
                    <SecondaryTextSmall>Completed this month</SecondaryTextSmall>
                    <TextBold>{completedInterviewsThisMonth.length}</TextBold>
                </InterviewMetaCard>

                <InterviewMetaCard>
                    <IconContainerGreen>
                        <CalendarCheck color={AccentColors.Green_500} />
                    </IconContainerGreen>
                    <SecondaryTextSmall>Completed this year</SecondaryTextSmall>
                    <TextBold>{completedInterviewsThisYear.length}</TextBold>
                </InterviewMetaCard>

                <InterviewMetaCard>
                    <IconContainerYellow>
                        <Trophy color={AccentColors.Orange_500} />
                    </IconContainerYellow>
                    <SecondaryTextSmall>Completed total</SecondaryTextSmall>
                    <TextBold>{completedInterviews.length}</TextBold>
                </InterviewMetaCard>
            </InterviewMetaContainer>

            <Tabs
                defaultActiveKey='1'
                items={[
                    {
                        label: `Current`,
                        key: "1",
                        children: <TabInterviews interviews={applyFilter(uncompletedInterviews)} />,
                    },
                    {
                        label: `Completed`,
                        key: "2",
                        children: (
                            <TabReports interviews={applyFilter(completedInterviews)} teamMembers={teamMembers} />
                        ),
                    },
                ]}
            />

            <ScheduleInterviewModal
                open={interviewModalVisible}
                onClose={() => setInterviewModalVisible(false)}
            />
        </Layout>
    );
};

export default Interviews;

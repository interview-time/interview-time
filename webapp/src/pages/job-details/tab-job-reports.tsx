import TabReports from "../interviews/tab-reports";
import React, { useEffect } from "react";
import { Interview, JobDetails, TeamMember, UserProfile } from "../../store/models";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { selectCompletedJobInterviews } from "../../store/interviews/selector";
import { selectTeamMembers } from "../../store/team/selector";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { loadInterviews } from "../../store/interviews/actions";
import { loadTeam } from "../../store/team/actions";
import { selectUserProfile } from "../../store/user/selector";

const InterviewsContainer = styled.div`
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    background-color: ${Colors.Neutral_50};
    border-radius: 6px;
    min-width: 800px;
    overflow: scroll;
`;

type Props = {
    jobDetails: JobDetails | undefined;
};

const TabJobReports = ({ jobDetails }: Props) => {
    const dispatch = useDispatch();

    const completedInterviews: Interview[] = useSelector(
        selectCompletedJobInterviews(jobDetails?.jobId || ""),
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

    return (
        <InterviewsContainer>
            <TabReports interviews={completedInterviews} teamMembers={teamMembers} />
        </InterviewsContainer>
    );
};

export default TabJobReports;

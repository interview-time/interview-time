import { Button, Col, Menu, Row } from "antd";
import StepJobType from "./step-job-type";
import styled from "styled-components";
import { Briefcase, ChevronLeft, ClipboardType, Cog } from "lucide-react";
import React, { useEffect, useState } from "react";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { Colors } from "../../assets/styles/colors";
import { useHistory } from "react-router-dom";
import StepJobDetails from "./step-job-details";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/state-models";
import { TeamDetails, UserProfile } from "../../store/models";
import { loadTeam } from "../../store/team/actions";
import StepJobStages from "./step-job-stages";
import { routeJobs } from "../../utils/route";

const MenuContainer = styled.div`
    margin-top: 64px;
`;

const MainMenu = styled(Menu)`
    &&& {
        border: 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 160px;
        margin-top: 48px;
    }
`;

const MenuItem = styled(Menu.Item)`
    && {
        display: flex;
        align-items: center;
        font-weight: 500;
        border-radius: 6px;
    }
`;

const BackButton = styled(Button)`
    color: ${Colors.Neutral_500};
`;

const MenuCol = styled(Col)`
    display: flex;
    justify-content: center;
`;

const ContentCol = styled(Col)`
    overflow-y: scroll;
    height: 100vh;
`;

enum Step {
    NEW_JOB = "NEW_JOB",
    DETAILS = "DETAILS",
    STAGES = "STAGES",
}

type Props = {};

const NewJob = ({}: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [selectedStep, setSelectedStep] = useState(Step.NEW_JOB);

    const profile: UserProfile = useSelector((state: RootState) => state.user.profile, shallowEqual);
    const teamDetails: TeamDetails | undefined = useSelector((state: RootState) => state.team.details, shallowEqual);

    useEffect(() => {
        if (profile.currentTeamId && !teamDetails) {
            dispatch(loadTeam(profile.currentTeamId));
        }
    }, [profile]);

    const onBackClicked = () => history.push(routeJobs());

    const onMenuItemClicked = (key: Step) => setSelectedStep(key);

    return (
        <Row gutter={[32, 32]}>
            <MenuCol xl={{ span: 5 }} md={{ span: 5 }}>
                <MenuContainer>
                    <BackButton
                        type='text'
                        onClick={onBackClicked}
                        icon={
                            <AntIconSpan>
                                <ChevronLeft size='1em' />
                            </AntIconSpan>
                        }
                    >
                        Back
                    </BackButton>
                    <MainMenu theme='light' mode='vertical' selectedKeys={[selectedStep]}>
                        <MenuItem
                            key={Step.NEW_JOB}
                            onClick={() => onMenuItemClicked(Step.NEW_JOB)}
                            icon={<Briefcase />}
                        >
                            Job
                        </MenuItem>
                        <MenuItem
                            key={Step.DETAILS}
                            onClick={() => onMenuItemClicked(Step.DETAILS)}
                            icon={<ClipboardType />}
                        >
                            Details
                        </MenuItem>
                        <MenuItem key={Step.STAGES} onClick={() => onMenuItemClicked(Step.STAGES)} icon={<Cog />}>
                            Stages
                        </MenuItem>
                    </MainMenu>
                </MenuContainer>
            </MenuCol>
            <ContentCol xl={{ span: 14 }} md={{ span: 19 }}>
                {selectedStep === Step.NEW_JOB && <StepJobType onNext={() => setSelectedStep(Step.DETAILS)} />}
                {selectedStep === Step.DETAILS && (
                    <StepJobDetails profile={profile} teamMembers={teamDetails?.teamMembers || []} />
                )}
                {selectedStep === Step.STAGES && <StepJobStages jobStages={[]} />}
            </ContentCol>
            <Col xl={{ span: 5 }} md={{ span: 0 }} />
        </Row>
    );
};

export default NewJob;

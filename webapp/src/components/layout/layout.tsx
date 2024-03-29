import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Divider, Dropdown, Layout as AntLayout, Menu, notification, Typography } from "antd";
import {
    routeCandidateAdd,
    routeCandidates,
    routeHome,
    routeInterviews,
    routeTeamNew,
    routeTeamProfile,
    routeTemplateBlank,
    routeTemplateLibrary,
    routeTemplates,
} from "../../utils/route";
import { joinTeam, switchTeam } from "../../store/user/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { defaultTo } from "lodash";
import { getJoinTeam, setJoinTeam } from "../../utils/storage";
import { CheckCircle2, ChevronDown, Gauge, LayoutTemplate, Settings, Users } from "lucide-react";
import { selectActiveTeam, selectUserProfile } from "../../store/user/selector";
import { Team, UserProfile } from "../../store/models";
import styled from "styled-components";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { Colors } from "../../assets/styles/colors";
import LogoSquare96 from "../../assets/logo-square-96.png";
import ActionsModal from "./quick-actions-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { TagNumber } from "../../assets/styles/global-styles";
import ScheduleInterviewModal from "../../pages/interview-schedule/schedule-interview-modal";

const { Text } = Typography;

const TeamContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TeamNameContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const PrimaryLink = styled.div`
    color: ${Colors.Primary_500};
`;

const TeamName = styled(Text)`
    color: ${Colors.Neutral_500};
    font-weight: 500;
    font-size: 14px;
`;

const TeamLabel = styled(Text)`
    color: ${Colors.Neutral_800};
    font-weight: 500;
    font-size: 14px;
`;

const TeamSettingsContainer = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    cursor: pointer;
`;

const CreateTeamContainer = styled.div`
    margin-right: 12px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
        background-color: ${Colors.Neutral_100};
    }
`;

const LogoSquare = styled.img`
    width: 48px;
    height: 48px;
    margin-left: 24px;
    margin-right: 12px;
    border-radius: 12px;
`;

const QuickActionsContainer = styled.div`
    height: 44px;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    border: 1px solid ${Colors.Neutral_200};
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 6px;
    padding-left: 12px;
    padding-right: 12px;
    cursor: pointer;

    &:hover {
        background-color: ${Colors.Neutral_50};
    }
`;

const QuickActionsText = styled(Text)`
    color: ${Colors.Neutral_400};
    flex-grow: 1;
`;

const QuickActionsHotkey = styled(TagNumber)`
    width: 20px;
    margin-left: 6px;
`;

const MainMenu = styled(Menu)`
    &&& {
        border: 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 20px 20px;
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

const MenuDivider = styled(Divider)`
    margin-top: 24px;
    margin-bottom: 24px;
    color: ${Colors.Neutral_200};
`;

const LayoutMenu = styled(AntLayout.Sider)`
    padding-top: 20px;
    border-right: 1px solid ${Colors.Neutral_200};
    z-index: 999;
`;

const LayoutMenuContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
`;

const PageLayout = styled(AntLayout)`
    height: 100vh;
`;

const PageContent = styled(AntLayout.Content)`
    padding: 32px;
    overflow-y: auto;
    background-color: ${Colors.Neutral_50};
`;

const MenuFooterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 12px;
`;

const MenuFooterText = styled(Text)`
    color: ${Colors.Neutral_400};
    font-size: 13px;
`;

type Props = {
    header?: React.ReactNode;
    children: React.ReactNode | React.ReactNode[];
};

const Layout = ({ header, children }: Props) => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    enum MenuKey {
        HOME = "HOME",
        TEMPLATES = "TEMPLATES",
        INTERVIEWS = "INTERVIEWS",
        CANDIDATES = "CANDIDATES",
        JOBS = "JOBS",
        SETTINGS = "SETTINGS",
        FEEDBACK = "FEEDBACK",
        NONE = "",
    }

    const profile: UserProfile = useSelector(selectUserProfile, shallowEqual);

    const [interviewVisible, setInterviewVisible] = useState(false);
    const [actionsVisible, setActionsVisible] = useState(false);

    useHotkeys("ctrl+k,Meta+k", () => setActionsVisible(true), []);

    useEffect(() => {
        let team = getJoinTeam();
        if (team) {
            openTeamJoinProgressNotification();
            dispatch(joinTeam(team));
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let joinTeamToken = getJoinTeam()?.token;
        if (joinTeamToken) {
            const joinedTeam = defaultTo(profile.teams, []).find((team: Team) => team.token === joinTeamToken);
            if (joinedTeam) {
                openTeamJoinSuccessNotification(joinedTeam);
                setJoinTeam(undefined);
            }
        }
        // eslint-disable-next-line
    }, [profile]);

    const getSelectedMenuKey = () => {
        if (location.pathname.includes(routeTemplates()) || location.pathname.includes(routeTemplateLibrary())) {
            return MenuKey.TEMPLATES;
        } else if (location.pathname.includes(routeInterviews())) {
            return MenuKey.INTERVIEWS;
        } else if (location.pathname.includes(routeCandidates())) {
            return MenuKey.CANDIDATES;
        } else if (location.pathname.includes("/account/")) {
            return MenuKey.SETTINGS;
        } else if (location.pathname.includes(routeHome())) {
            return MenuKey.HOME;
        } else {
            return MenuKey.NONE;
        }
    };

    const joinTeamNotification = "join-team-notification";

    const openTeamJoinProgressNotification = () => {
        notification.open({
            key: joinTeamNotification,
            message: "Team",
            description: "Team join in progress.",
            icon: <LoadingOutlined />,
        });
    };

    const openTeamJoinSuccessNotification = (team: Team) => {
        notification["success"]({
            key: joinTeamNotification,
            message: "Team",
            description: `You have successfully joined '${team.teamName}' team.`,
        });
        onTeamSelected(team);
    };

    const onActionsClicked = () => {
        setActionsVisible(true);
    };

    const onActionsClose = () => {
        setActionsVisible(false);
    };

    const onTeamSelected = (team: Team) => {
        const selected = {
            teamName: team.teamName,
            teamId: team.teamId,
        };
        dispatch(switchTeam(selected.teamId));
        history.push(routeHome());
    };

    const onCreateTeam = () => history.push(routeTeamNew());

    const onTeamProfileClicked = () => history.push(routeTeamProfile());

    const onScheduleInterview = () => {
        setActionsVisible(false);
        setInterviewVisible(true);
    };

    const onAddCandidate = () => history.push(routeCandidateAdd());

    const onCreateTemplate = () => history.push(routeTemplateBlank());

    // @ts-ignore
    const teamMenuItems: ItemType[] = defaultTo(profile.teams, [])
        .map((team: Team) => ({
            key: team.teamId,
            label: team.teamName,
            onClick: () => onTeamSelected(team),
        }))
        .concat([
            {
                type: "divider",
            },
            {
                key: "create-team",
                label: <PrimaryLink>Create New Team</PrimaryLink>,
                onClick: () => onCreateTeam(),
            },
        ]);

    const getQuickActionsHotkeySymbol = () => {
        // noinspection JSDeprecatedSymbols
        return (window.navigator?.userAgent || window.navigator?.appVersion || window.navigator?.platform)
            .toLowerCase()
            .indexOf("mac") >= 0
            ? "⌘"
            : "^";
    };

    return (
        <PageLayout>
            <LayoutMenu theme='light' breakpoint='lg' collapsedWidth='0' width={280}>
                <LayoutMenuContainer>
                    <TeamContainer>
                        <TeamSettingsContainer onClick={onTeamProfileClicked}>
                            <LogoSquare alt='InterviewTime' src={LogoSquare96} />
                            <TeamNameContainer>
                                <TeamLabel>Team</TeamLabel>
                                <TeamName>{selectActiveTeam(profile)?.teamName}</TeamName>
                            </TeamNameContainer>
                        </TeamSettingsContainer>
                        <Dropdown
                            placement='bottomRight'
                            menu={{
                                items: teamMenuItems,
                            }}
                        >
                            <CreateTeamContainer>
                                <ChevronDown />
                            </CreateTeamContainer>
                        </Dropdown>
                    </TeamContainer>
                    <QuickActionsContainer onClick={onActionsClicked}>
                        <QuickActionsText>Quick Actions</QuickActionsText>
                        <QuickActionsHotkey>{getQuickActionsHotkeySymbol()}</QuickActionsHotkey>
                        <QuickActionsHotkey>K</QuickActionsHotkey>
                    </QuickActionsContainer>
                    <MainMenu
                        theme='light'
                        mode='vertical'
                        defaultSelectedKeys={[routeHome()]}
                        selectedKeys={[getSelectedMenuKey()]}
                    >
                        <MenuItem key={MenuKey.HOME} icon={<Gauge />}>
                            <Link to={routeHome()}>Dashboard</Link>
                        </MenuItem>
                        <MenuItem key={MenuKey.CANDIDATES} icon={<Users />}>
                            <Link to={routeCandidates()}>Candidates</Link>
                        </MenuItem>
                        <MenuItem key={MenuKey.INTERVIEWS} icon={<CheckCircle2 />}>
                            <Link to={routeInterviews()}>Interviews</Link>
                        </MenuItem>
                        <MenuItem key={MenuKey.TEMPLATES} icon={<LayoutTemplate />}>
                            <Link to={routeTemplates()}>Templates</Link>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem key={MenuKey.SETTINGS} icon={<Settings />}>
                            <Link to={routeTeamProfile()}>Settings</Link>
                        </MenuItem>
                    </MainMenu>
                    <MenuFooterContainer>
                        <MenuFooterText>v{process.env.REACT_APP_VERSION}</MenuFooterText>
                    </MenuFooterContainer>
                </LayoutMenuContainer>
            </LayoutMenu>
            <AntLayout>
                {header}
                <PageContent>
                    {/*@ts-ignore*/}
                    <ActionsModal
                        open={actionsVisible}
                        onClose={onActionsClose}
                        onAddCandidate={onAddCandidate}
                        onScheduleInterview={onScheduleInterview}
                        onCreateTemplate={onCreateTemplate}
                    />
                    <ScheduleInterviewModal open={interviewVisible} onClose={() => setInterviewVisible(false)} />
                    {children}
                </PageContent>
            </AntLayout>
        </PageLayout>
    );
};

export default Layout;

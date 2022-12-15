import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Badge, Button, Divider, Dropdown, Layout as AntLayout, Menu, notification, Typography } from "antd";
import styles from "./layout.module.css";
import {
    routeCandidateAdd,
    routeCandidates,
    routeHome,
    routeInterviewAdd,
    routeInterviews,
    routeProfile,
    routeReports,
    routeTeamNew,
    routeTeamProfile,
    routeTemplateBlank,
    routeTemplateLibrary,
    routeTemplates,
} from "../../utils/route";

import FeedbackModal from "../../pages/feedback/modal-feedback";
import { joinTeam, switchTeam } from "../../store/user/actions";
import { connect } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { defaultTo } from "lodash";
import { getJoinTeam, isUpdateAvailable, setJoinTeam } from "../../utils/storage";
import NewsModal from "../../pages/news/modal-news";
import { CheckCircle2, ChevronDown, Gauge, LayoutTemplate, MessageCircle, Settings, Users } from "lucide-react";
import { selectActiveTeam } from "../../store/user/selector";
import { RootState } from "../../store/state-models";
import { Team, UserProfile } from "../../store/models";
import styled from "styled-components";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { Colors } from "../../assets/styles/colors";
import LogoSquare96 from "../../assets/logo-square-96.png";
import ActionsModal from "./quick-actions-modal";
import { useHotkeys } from "react-hotkeys-hook";

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

const QuickActionsHotkey = styled(Text)`
    width: 20px;
    height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: ${Colors.Neutral_600};
    background: ${Colors.Neutral_100};
    border-radius: 6px;
    margin-left: 6px;
    justify-content: center;
    display: inline-flex;
    align-items: center;
`;

type Props = {
    children: any;
    pageHeader?: any;
    profile: UserProfile;
    contentStyle?: any;
    switchTeam: Function;
    joinTeam: Function;
};

const Layout = ({ children, pageHeader, contentStyle, profile, switchTeam, joinTeam }: Props) => {
    const location = useLocation();
    const history = useHistory();

    const MENU_KEY_PROFILE = "PROFILE";
    const MENU_KEY_HOME = "HOME";
    const MENU_KEY_TEMPLATES = "TEMPLATES";
    const MENU_KEY_INTERVIEWS = "INTERVIEWS";
    const MENU_KEY_REPORTS = "REPORTS";
    const MENU_KEY_CANDIDATES = "CANDIDATES";

    const [actionsVisible, setActionsVisible] = React.useState(false);
    const [feedbackVisible, setFeedbackVisible] = React.useState(false);
    const [newsVisible, setNewsVisible] = React.useState(isUpdateAvailable());

    useHotkeys("ctrl+k,Meta+k", () => setActionsVisible(true), []);

    React.useEffect(() => {
        let team = getJoinTeam();
        if (team) {
            openTeamJoinProgressNotification();
            joinTeam(team);
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let joinTeamToken = getJoinTeam()?.token;
        if (joinTeamToken) {
            const joinedTeam = defaultTo(profile.teams, []).find((team: Team) => team.token === joinTeamToken);
            if (joinedTeam) {
                openTeamJoinSuccessNotification(joinedTeam);
                setJoinTeam(null);
            }
        }
        // eslint-disable-next-line
    }, [profile]);

    const getSelectedMenuKey = () => {
        if (location.pathname.includes(routeTemplates()) || location.pathname.includes(routeTemplateLibrary())) {
            return MENU_KEY_TEMPLATES;
        } else if (location.pathname.includes(routeInterviews())) {
            return MENU_KEY_INTERVIEWS;
        } else if (location.pathname.includes(routeReports())) {
            return MENU_KEY_REPORTS;
        } else if (location.pathname.includes(routeCandidates())) {
            return MENU_KEY_CANDIDATES;
        } else if (location.pathname.includes(routeProfile())) {
            return MENU_KEY_PROFILE;
        } else if (location.pathname.includes("/account/team")) {
            return "settings";
        } else if (location.pathname.includes(routeHome())) {
            return MENU_KEY_HOME;
        } else {
            return "";
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

    const onFeedbackClicked = () => {
        setFeedbackVisible(true);
    };

    const onFeedbackClose = () => {
        setFeedbackVisible(false);
    };

    const onNewsClicked = () => {
        setNewsVisible(true);
    };

    const onNewsClose = () => {
        setNewsVisible(false);
    };

    const onTeamSelected = (team: Team) => {
        const selected = {
            teamName: team.teamName,
            teamId: team.teamId,
        };
        switchTeam(selected.teamId);
        history.push(routeHome());
    };

    const onCreateTeam = () => {
        history.push(routeTeamNew());
    };

    const onTeamProfileClicked = () => {
        history.push(routeTeamProfile());
    };

    const onScheduleInterview = () => {
        history.push(routeInterviewAdd());
    };

    const onAddCandidate = () => {
        history.push(routeCandidateAdd());
    };

    const onCreateTemplate = () => {
        history.push(routeTemplateBlank());
    };

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
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider
                theme='light'
                breakpoint='lg'
                collapsedWidth='0'
                width={280}
                className={styles.globalSider}
            >
                <div className={styles.globalSiderContainer}>
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
                    <Menu
                        theme='light'
                        mode='vertical'
                        defaultSelectedKeys={[routeHome()]}
                        selectedKeys={[getSelectedMenuKey()]}
                        className={styles.menu}
                    >
                        <Menu.Item key={MENU_KEY_HOME} className={styles.menuItem} icon={<Gauge />}>
                            <Link to={routeHome()}>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key={MENU_KEY_CANDIDATES} className={styles.menuItem} icon={<Users />}>
                            <Link to={routeCandidates()}>Candidates</Link>
                        </Menu.Item>
                        <Menu.Item key={MENU_KEY_INTERVIEWS} className={styles.menuItem} icon={<CheckCircle2 />}>
                            <Link to={routeInterviews()}>Interviews</Link>
                        </Menu.Item>
                        <Menu.Item key={MENU_KEY_TEMPLATES} className={styles.menuItem} icon={<LayoutTemplate />}>
                            <Link to={routeTemplates()}>Templates</Link>
                        </Menu.Item>
                        <Divider className={styles.divider} />
                        <Menu.Item key='settings' className={styles.menuItem} icon={<Settings />}>
                            <Link to={routeTeamProfile()}>Settings</Link>
                        </Menu.Item>
                        <Menu.Item
                            key='feedback'
                            className={styles.menuItem}
                            icon={<MessageCircle />}
                            onClick={onFeedbackClicked}
                        >
                            Feedback
                        </Menu.Item>
                    </Menu>
                    <div className={styles.versionContainer}>
                        <Button type='link' onClick={onNewsClicked}>
                            <Badge dot={isUpdateAvailable()} offset={[6, 4]}>
                                <span className={styles.whatsNew}>What's New</span>
                            </Badge>
                        </Button>

                        <div className={styles.version}>v{process.env.REACT_APP_VERSION}</div>
                    </div>
                </div>
            </AntLayout.Sider>
            <AntLayout className='site-layout'>
                {pageHeader}
                <AntLayout.Content className={`${styles.pageContent} ${contentStyle}`}>
                    {/*@ts-ignore*/}
                    <FeedbackModal visible={feedbackVisible} onClose={onFeedbackClose} />
                    <NewsModal visible={newsVisible} onClose={onNewsClose} />
                    <ActionsModal
                        open={actionsVisible}
                        onClose={onActionsClose}
                        onAddCandidate={onAddCandidate}
                        onScheduleInterview={onScheduleInterview}
                        onCreateTemplate={onCreateTemplate}
                    />
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    );
};

const mapDispatch = { switchTeam, joinTeam };

const mapState = (state: RootState) => {
    const userState = state.user || {};

    return {
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Layout);

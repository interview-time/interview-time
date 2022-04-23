import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Badge, Button, Divider, Layout as AntLayout, Menu, notification, Select } from "antd";
import styles from "./layout.module.css";
import {
    CandidatesIcon,
    FeedbackIcon,
    HomeIcon,
    InterviewIcon,
    ProfileIcon,
    TextNoteIcon,
    UserAddIcon,
} from "../utils/icons";
import {
    routeAccount,
    routeCandidates,
    routeHome,
    routeInterviewAdd,
    routeInterviews,
    routeReports,
    routeTeamNew,
    routeTeamSettings,
    routeTemplateLibrary,
    routeTemplates,
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import Avatar from "antd/es/avatar/avatar";
import { truncate } from "lodash/string";
import FeedbackModal from "../../pages/feedback/modal-feedback";
import { joinTeam, setActiveTeam } from "../../store/user/actions";
import { connect } from "react-redux";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { defaultTo } from "lodash/util";
import Text from "antd/lib/typography/Text";
import { getJoinTeam, isUpdateAvailable, setJoinTeam, updateNewsVisitTime } from "../utils/storage";
import NewsModal from "../../pages/news/modal-news";

/**
 * @typedef {Object} ActiveTeam
 * @property {string|null} teamId - if not null team is selected, otherwise user is selected
 * @property {string} teamName
 * @property {string} picture
 */

/**
 *
 * @param children
 * @param pageHeader
 * @param contentStyle
 * @param {UserProfile} profile
 * @param setTemplates
 * @param setActiveTeam
 * @param joinTeam
 * @returns {JSX.Element}
 * @constructor
 */
const Layout = ({ children, pageHeader, contentStyle, profile, setActiveTeam, joinTeam }) => {
    const location = useLocation();
    const history = useHistory();
    const { user } = useAuth0();

    const MENU_KEY_PROFILE = "PROFILE";
    const MENU_KEY_HOME = "HOME";
    const MENU_KEY_TEMPLATES = "TEMPLATES";
    const MENU_KEY_INTERVIEWS = "INTERVIEWS";
    const MENU_KEY_REPORTS = "REPORTS";
    const MENU_KEY_CANDIDATES = "CANDIDATES";

    const [feedbackVisible, setFeedbackVisible] = React.useState(false);
    const [newsVisible, setNewsVisible] = React.useState(false);

    React.useEffect(() => {
        let team = getJoinTeam();
        if (team) {
            openTeamJoinProgressNotification();
            joinTeam(team);
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let team = getJoinTeam();
        if (team) {
            const joinedTeam = defaultTo(profile.teams, []).find(t => t.token === team.token);
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
        } else if (location.pathname.includes(routeAccount())) {
            return MENU_KEY_PROFILE;
        } else if (location.pathname.includes("settings")) {
            return "settings";
        } else if (location.pathname.includes(routeHome())) {
            return MENU_KEY_HOME;
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

    const openTeamJoinSuccessNotification = team => {
        notification["success"]({
            key: joinTeamNotification,
            message: "Team",
            description: `You have successfully joined '${team.teamName}' team.`,
        });
        onTeamSelected(team);
    };

    const onFeedbackClicked = () => {
        setFeedbackVisible(true);
    };

    const onFeedbackClose = () => {
        setFeedbackVisible(false);
    };

    const onNewsClicked = () => {
        setNewsVisible(true);
        updateNewsVisitTime();
    };

    const onNewsClose = () => {
        setNewsVisible(false);
    };

    const onTeamSelected = team => {
        const selected = {
            teamName: team.teamName,
            teamId: team.teamId,
        };
        setActiveTeam(selected.teamId);
        history.push(routeHome());
    };

    const onTeamChange = value => onTeamSelected(profile.teams.find(team => team.teamId === value));

    const onCreateTeam = () => {
        history.push(routeTeamNew());
    };

    const onNewInterviewClicked = () => {
        history.push(routeInterviewAdd());
    };

    const teamOptions = defaultTo(profile.teams, []).map(team => ({
        value: team.teamId,
        label: team.teamName,
    }));

    const getProfileName = () =>
        truncate(profile.name, {
            length: 20,
        });

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
                    <div className={styles.logoHolder}>
                        <img alt='Interviewer' src={process.env.PUBLIC_URL + "/logo192.png"} className={styles.logo} />
                        <span className={styles.logoText}>Interviewer</span>
                    </div>
                    <Menu
                        theme='light'
                        mode='vertical'
                        defaultSelectedKeys={[routeHome()]}
                        selectedKeys={[getSelectedMenuKey()]}
                        className={styles.menu}
                    >
                        <Link to={routeAccount()} className={styles.profileHolder}>
                            <Avatar
                                src={user ? user.picture : null}
                                className={styles.avatar}
                                size={32}
                                icon={<ProfileIcon />}
                            />
                            <Text className={styles.profileButton} type='text'>
                                {getProfileName()}
                            </Text>
                        </Link>
                        <Select
                            placeholder='Select interview template'
                            onChange={onTeamChange}
                            value={profile.currentTeamId}
                            options={teamOptions}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: "4px 0" }} />
                                    <Button style={{ paddingLeft: 12 }} type='link' onClick={onCreateTeam}>
                                        Create New Team
                                    </Button>
                                </div>
                            )}
                        />
                        <Divider className={styles.divider} />
                        <Button
                            type='primary'
                            icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                            onClick={onNewInterviewClicked}
                            className={styles.newInterviewButton}
                        >
                            New Interview
                        </Button>
                        <Menu.Item key={MENU_KEY_HOME} className={styles.menuItem} icon={<HomeIcon />}>
                            <Link to={routeHome()}>
                                <span className='nav-text'>Dashboard</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key={MENU_KEY_INTERVIEWS} className={styles.menuItem} icon={<InterviewIcon />}>
                            <Link to={routeInterviews()}>
                                <span className='nav-text'>Interviews</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key={MENU_KEY_TEMPLATES}
                            className={styles.menuItem}
                            icon={<TextNoteIcon style={{ fontSize: 24 }} />}
                        >
                            <Link to={routeTemplates()}>
                                <span className='nav-text'>Templates</span>
                            </Link>
                        </Menu.Item>                  
                        <Menu.Item key={MENU_KEY_CANDIDATES} className={styles.menuItem} icon={<CandidatesIcon />}>
                            <Link to={routeCandidates()}>
                                <span className='nav-text'>Candidates</span>
                            </Link>
                        </Menu.Item>
                        <Divider className={styles.divider} />
                        <Menu.Item key='settings' className={styles.menuItem} icon={<UserAddIcon />}>
                            <Link to={routeTeamSettings(profile.currentTeamId)}>
                                <span className='nav-text'>Team settings</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key='feedback'
                            className={styles.menuItem}
                            icon={<FeedbackIcon />}
                            onClick={onFeedbackClicked}
                        >
                            <span className='nav-text'>Provide feedback</span>
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
                    <FeedbackModal visible={feedbackVisible} onClose={onFeedbackClose} />
                    <NewsModal visible={newsVisible} onClose={onNewsClose} />
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    );
};

const mapDispatch = { setActiveTeam, joinTeam };

const mapState = state => {
    const userState = state.user || {};

    return {
        profile: userState.profile,
    };
};

export default connect(mapState, mapDispatch)(Layout);

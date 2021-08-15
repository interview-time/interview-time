import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Divider, Dropdown, Layout as AntLayout, Menu } from "antd";
import styles from "./layout.module.css";
import {
    CandidatesIcon,
    FeedbackIcon,
    GuideIcon,
    HomeIcon,
    InterviewIcon,
    ProfileIcon,
    SettingsIcon,
    TeamCircleIcon,
    TeamCreateIcon,
    TeamIcon,
    TeamSelectedIcon,
    TeamSwitcherIcon
} from "../utils/icons";
import {
    routeAccount,
    routeHome,
    routeInterviews,
    routeNews,
    routeReports,
    routeTeamNew,
    routeTeamSettings,
    routeTemplateNew,
    routeTemplates
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import Avatar from "antd/es/avatar/avatar";
import { truncate } from "lodash/string";
import FeedbackModal from "../../pages/feedback/modal-feedback";
import { setActiveTeam } from "../../store/user/actions";
import { connect } from "react-redux";
import Text from "antd/lib/typography/Text";

const menuIconStyle = { fontSize: '24px' }

/**
 *
 * @param children
 * @param pageHeader
 * @param contentStyle
 * @param {UserProfile} profile
 * @param activeTeam
 * @param setActiveTeam
 * @param setTemplates
 * @returns {JSX.Element}
 * @constructor
 */
const Layout = ({ children, pageHeader, contentStyle, profile, activeTeam, setActiveTeam }) => {

    const location = useLocation();
    const history = useHistory();
    const { user } = useAuth0();

    const [feedbackVisible, setFeedbackVisible] = React.useState(false)

    const getActiveTeam = () => {
        return activeTeam ? activeTeam : {
            name: user.name,
            picture: user.picture
        };
    }

    const getActiveTeamName = () => truncate(getActiveTeam().teamName, {
        'length': 14
    })

    const getSelectedKey = () => {
        if (location.pathname.includes(routeTemplates())) {
            return routeTemplates()
        } else if (location.pathname.includes(routeInterviews())) {
            return routeInterviews()
        } else if (location.pathname.includes(routeNews())) {
            return routeNews()
        } else if (location.pathname.includes(routeTemplateNew())) {
            return routeTemplateNew()
        } else if (location.pathname.includes(routeReports())) {
            return routeReports()
        } else if (location.pathname.includes("settings") || location.pathname.includes("account")) {
            return "settings"
        } else if (location.pathname.includes(routeHome())) {
            return routeHome()
        }
    }

    const onFeedbackClicked = () => {
        setFeedbackVisible(true)
    }

    const onFeedbackClose = () => {
        setFeedbackVisible(false)
    }

    const onTeamSelected = (team) => {
        const selected = {
            teamId: team.teamId,
            teamName: team.teamName
        };
        if (selected.teamId !== activeTeam.teamId) {
            setActiveTeam(selected);
            history.push(routeHome());
        }
    }

    const onUserSelected = () => {
        const selected = {
            teamName: user.name,
            picture: user.picture
        };
        if (selected.teamName !== activeTeam.teamName) {
            setActiveTeam(selected);
            history.push(routeHome());
        }
    }

    const onCreateTeam = () => {
        history.push(routeTeamNew())
    }

    const teamMenu = (
        <Menu>
            <Menu.Item onClick={() => onUserSelected()}>
                <div className={styles.menuTeam}>
                    <Avatar
                        src={user ? user.picture : null}
                        className={styles.avatar}
                        size={24}
                        icon={<ProfileIcon />} />
                    <div className={styles.menuTeamText}>
                        <Text>{profile.name}</Text>
                        <Text type="secondary">Personal</Text>
                    </div>
                    {!getActiveTeam().teamId && <TeamSelectedIcon />}
                </div>
            </Menu.Item>
            <Menu.Divider />
            {profile.teams.map(team => <>
                <Menu.Item onClick={() => onTeamSelected(team)}>
                    <div className={styles.menuTeam}>
                        <TeamIcon style={menuIconStyle} />
                        <div className={styles.menuTeamText}>
                            <Text>{team.teamName}</Text>
                            <Text type="secondary">Team</Text>
                        </div>
                        {getActiveTeam().teamId === team.teamId && <TeamSelectedIcon />}
                    </div>
                </Menu.Item>
                <Menu.Divider />
            </>)}
            <Menu.Item onClick={() => onCreateTeam()}>
                <div className={styles.menuTeam}>
                    <TeamCreateIcon style={menuIconStyle} />
                    <div className={styles.menuTeamCreate}>
                        <Link>Create Team</Link>
                    </div>
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <img alt="Interviewer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
                <Menu theme="light"
                      mode="vertical"
                      defaultSelectedKeys={[routeHome()]}
                      selectedKeys={[getSelectedKey()]}
                      className={styles.menu}
                >
                    <Menu.Item key={routeHome()} className={styles.menuItem}
                               icon={<HomeIcon style={menuIconStyle} />}>
                        <Link to={routeHome()}>
                            <span className="nav-text">Home</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={routeTemplates()} className={styles.menuItem}
                               icon={<GuideIcon style={menuIconStyle} />}>
                        <Link to={routeTemplates()}>
                            <span className="nav-text">Templates</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={routeInterviews()} className={styles.menuItem}
                               icon={<InterviewIcon style={menuIconStyle} />}>
                        <Link to={routeInterviews()}>
                            <span className="nav-text">Interviews</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={routeReports()} className={styles.menuItem}
                               icon={<CandidatesIcon style={menuIconStyle} />}>
                        <Link to={routeReports()}>
                            <span className="nav-text">Reports</span>
                        </Link>
                    </Menu.Item>
                    <div className={styles.space} />
                    <Menu.Item key="feedback" className={styles.menuItem}
                               icon={<FeedbackIcon style={menuIconStyle} />}
                               onClick={onFeedbackClicked}>
                        <span className="nav-text">Feedback</span>
                    </Menu.Item>
                    <Divider style={{ margin: 8 }} />
                    <Menu.Item key="settings" className={styles.menuItem}
                               icon={<SettingsIcon style={menuIconStyle} />}>
                        <Link to={getActiveTeam().teamId ? routeTeamSettings(getActiveTeam().teamId) : routeAccount()}>
                            <span
                                className="nav-text">{getActiveTeam().teamId ? "Team Settings" : "User Settings"}</span>
                        </Link>
                    </Menu.Item>
                    <div>
                        <Dropdown overlay={teamMenu}>
                            <div className={styles.selectedTeam}>
                                {!getActiveTeam().teamId && <Avatar
                                    src={user ? getActiveTeam().picture : null}
                                    className={styles.avatar}
                                    size={28}
                                    icon={<ProfileIcon />} />}
                                {getActiveTeam().teamId && <TeamCircleIcon />}
                                <Text className={styles.selectedTeamText}>{getActiveTeamName()}</Text>
                                <TeamSwitcherIcon />
                            </div>
                        </Dropdown>
                    </div>
                </Menu>
            </AntLayout.Sider>
            <AntLayout className="site-layout">
                {pageHeader}
                <AntLayout.Content className={contentStyle ? contentStyle : styles.pageContent}>
                    <FeedbackModal
                        visible={feedbackVisible}
                        onClose={onFeedbackClose}
                    />
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    )
};

const mapDispatch = { setActiveTeam };

const mapState = (state) => {
    const userState = state.user || {};

    return {
        profile: userState.profile,
        activeTeam: userState.activeTeam
    };
};

export default connect(mapState, mapDispatch)(Layout)
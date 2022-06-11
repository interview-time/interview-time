import Card from "../../components/card/card";
import { Menu } from "antd";
import styles from "./team-menu.module.css";
import React from "react";
import { routeTeam, routeTeamProfile } from "../../utils/route";

/**
 *
 * @param {Team} team
 * @param {LocationState} location
 * @param {function} onTeamProfileClicked
 * @param {function} onTeamClicked
 * @param {CSS} style
 * @returns {JSX.Element}
 * @constructor
 */
const TeamMenu = ({ team, location, onTeamProfileClicked, onTeamClicked, style }) => {
    const MENU_KEY_TEAM_PROFILE = "TEAM_PROFILE";
    const MENU_KEY_TEAM = "TEAM";

    const getSelectedMenuKey = () => {
        if (location.pathname.includes(routeTeamProfile())) {
            return MENU_KEY_TEAM_PROFILE;
        } else if (location.pathname.includes(routeTeam())) {
            return MENU_KEY_TEAM;
        }
    };

    return (
        <div style={style}>
            <Card className={styles.menuCard}>
                <div className={styles.teamName}>{team.teamName}</div>

                <Menu className={styles.menu} theme='light' mode='vertical' selectedKeys={[getSelectedMenuKey()]}>
                    <Menu.Item key={MENU_KEY_TEAM_PROFILE} onClick={onTeamProfileClicked}>
                        <span className={styles.menuItem}>Company Profile</span>
                    </Menu.Item>
                    <Menu.Item key={MENU_KEY_TEAM} onClick={onTeamClicked}>
                        <span className={styles.menuItem}>Team</span>
                    </Menu.Item>
                </Menu>
            </Card>
        </div>
    );
};

export default TeamMenu;

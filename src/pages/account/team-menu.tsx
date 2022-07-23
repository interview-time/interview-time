import Card from "../../components/card/card";
import { Menu } from "antd";
import styles from "./team-menu.module.css";
import React, { CSSProperties } from "react";
import { routeTeamBilling, routeTeamMembers, routeTeamProfile } from "../../utils/route";
import { Location } from "history";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { Team } from "../../store/models";

/**
 *
 * @param {Team} team
 * @param {LocationState} location
 * @param {function} onTeamProfileClicked
 * @param {function} onTeamClicked
 * @param {function} onTeamBillingClicked
 * @param {CSS} style
 * @returns {JSX.Element}
 * @constructor
 */

type Props = {
    team?: Team;
    location: Location;
    style: CSSProperties;
    onTeamProfileClicked: MenuClickEventHandler;
    onTeamClicked: MenuClickEventHandler;
    onTeamBillingClicked: MenuClickEventHandler;
};

const TeamMenu = ({ team, location, onTeamProfileClicked, onTeamClicked, onTeamBillingClicked, style }: Props) => {
    const MENU_KEY_TEAM_PROFILE = "TEAM_PROFILE";
    const MENU_KEY_TEAM_MEMBERS = "TEAM_MEMBERS";
    const MENU_KEY_TEAM_BILLING = "TEAM_BILLING";

    const getSelectedMenuKey = (): string => {
        if (location.pathname.includes(routeTeamProfile())) {
            return MENU_KEY_TEAM_PROFILE;
        } else if (location.pathname.includes(routeTeamMembers())) {
            return MENU_KEY_TEAM_MEMBERS;
        } else if (location.pathname.includes(routeTeamBilling())) {
            return MENU_KEY_TEAM_BILLING;
        }
        return "";
    };

    return (
        <div style={style}>
            <Card className={styles.menuCard}>
                <div className={styles.teamName}>{team?.teamName}</div>

                <Menu className={styles.menu} theme='light' mode='vertical' selectedKeys={[getSelectedMenuKey()]}>
                    <Menu.Item key={MENU_KEY_TEAM_PROFILE} onClick={onTeamProfileClicked}>
                        <span className={styles.menuItem}>Company profile</span>
                    </Menu.Item>
                    <Menu.Item key={MENU_KEY_TEAM_MEMBERS} onClick={onTeamClicked}>
                        <span className={styles.menuItem}>Team members</span>
                    </Menu.Item>
                    <Menu.Item key={MENU_KEY_TEAM_BILLING} onClick={onTeamBillingClicked}>
                        <span className={styles.menuItem}>Billing</span>
                    </Menu.Item>
                </Menu>
            </Card>
        </div>
    );
};

export default TeamMenu;

import Card from "../../components/card/card";
import { Menu } from "antd";
import styles from "./team-menu.module.css";
import React, { CSSProperties } from "react";
import { routeTeamMembers, routeTeamProfile } from "../../utils/route";
import { Location } from "history";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { Team } from "../../store/models";

type Props = {
    team?: Team;
    location: Location;
    style: CSSProperties;
    onTeamProfileClicked: MenuClickEventHandler;
    onTeamClicked: MenuClickEventHandler;
};

const TeamMenu = ({ team, location, style, onTeamProfileClicked, onTeamClicked }: Props) => {
    const MENU_KEY_TEAM_PROFILE = "TEAM_PROFILE";
    const MENU_KEY_TEAM_MEMBERS = "TEAM_MEMBERS";

    const getSelectedMenuKey = (): string => {
        if (location.pathname.includes(routeTeamProfile())) {
            return MENU_KEY_TEAM_PROFILE;
        } else if (location.pathname.includes(routeTeamMembers())) {
            return MENU_KEY_TEAM_MEMBERS;
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
                </Menu>
            </Card>
        </div>
    );
};

export default TeamMenu;

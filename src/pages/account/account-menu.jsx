import Card from "../../components/card/card";
import { Menu } from "antd";
import styles from "./account-menu.module.css";
import React from "react";
import { truncate } from "lodash/string";
import { selectProfileName } from "../../store/user/user";
import { routeProfile } from "../../components/utils/route";

/**
 *
 * @param {UserProfile} profile
 * @param {LocationState} location
 * @param {function} onProfileClicked
 * @returns {JSX.Element}
 * @constructor
 */
const AccountMenu = ({ profile, location, onProfileClicked }) => {
    const MENU_KEY_PROFILE = "PROFILE";

    const getProfileName = () =>
        truncate(selectProfileName(profile), {
            length: 20,
        });

    const getSelectedMenuKey = () => {
        if (location.pathname.includes(routeProfile())) {
            return MENU_KEY_PROFILE;
        }
    };

    return (
        <div>
            <Card className={styles.menuCard}>
                <div className={styles.userName}>{getProfileName()}</div>

                <Menu className={styles.menu} theme='light' mode='vertical' selectedKeys={[getSelectedMenuKey()]}>
                    <Menu.Item key={MENU_KEY_PROFILE} onClick={onProfileClicked}>
                        <span className={styles.menuItem}>Profile</span>
                    </Menu.Item>
                </Menu>
            </Card>
        </div>
    );
};

export default AccountMenu;

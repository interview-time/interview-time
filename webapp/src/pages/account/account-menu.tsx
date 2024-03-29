import Card from "../../components/card/card";
import { Menu } from "antd";
import styles from "./account-menu.module.css";
import React from "react";
import { truncate } from "lodash";
import { selectProfileName } from "../../store/user/selector";
import { routeProfile } from "../../utils/route";
import { Location } from "history";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { UserProfile } from "../../store/models";

type Props = {
    profile?: UserProfile;
    location: Location;
    onProfileClicked: MenuClickEventHandler;
};

const AccountMenu = ({ profile, location, onProfileClicked }: Props) => {
    const MENU_KEY_PROFILE = "PROFILE";

    const getProfileName = () =>
        truncate(selectProfileName(profile), {
            length: 20,
        });

    const getSelectedMenuKey = (): string => (location.pathname.includes(routeProfile()) ? MENU_KEY_PROFILE : "");

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

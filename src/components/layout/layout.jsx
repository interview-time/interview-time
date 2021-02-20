import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Divider, Layout as AntLayout, Menu} from "antd";
import styles from "./layout.module.css";
import { CommunityIcon, GuideIcon, InterviewIcon, ProfileIcon, QuestionBankIcon, SignOutIcon } from "../utils/icons";
import {
    routeAccount,
    routeCommunity,
    routeInterviews,
    routeQuestionBank,
    routeQuickstart,
    routeTemplates
} from "../utils/route";
import { useAuth0 } from "../../react-auth0-spa";

const menuIconStyle = { fontSize: '24px' }

const Layout = ({ children, pageHeader }) => {

    const location = useLocation();
    const { logout } = useAuth0();

    const getSelectedKey = () => {
        if(location.pathname.includes(routeQuestionBank())) {
            return routeQuestionBank()
        } else if(location.pathname.includes(routeTemplates())) {
            return routeTemplates()
        } else if(location.pathname.includes(routeInterviews())) {
            return routeInterviews()
        } else if(location.pathname.includes(routeAccount())) {
            return routeAccount()
        }
    }

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <a href={routeQuickstart()}>
                    <img alt="Interviewer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
                </a>
                <Menu theme="light"
                    mode="inline"
                    defaultSelectedKeys={[routeQuestionBank()]}
                    selectedKeys={[getSelectedKey()]}
                    className={styles.menu}
                >
                    <Menu.Item key={routeQuestionBank()} className={styles.menuItem}
                        icon={<QuestionBankIcon style={menuIconStyle} />}>
                        <Link to={routeQuestionBank()}>
                            <span className="nav-text">Question Bank</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={routeTemplates()} className={styles.menuItem} icon={<GuideIcon style={menuIconStyle} />}>
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
                    <Menu.Item key={routeCommunity()} className={styles.menuItem}
                               icon={<CommunityIcon style={menuIconStyle} />}>
                        <Link to={routeCommunity()}>
                            <span className="nav-text">Community</span>
                        </Link>
                    </Menu.Item>
                    <Divider />
                    <Menu.Item key={routeAccount()} className={styles.menuItem}
                        icon={<ProfileIcon style={menuIconStyle} />}>
                        <Link to={routeAccount()}>
                            <span className="nav-text">Profile</span>
                        </Link>
                    </Menu.Item>
                </Menu>
                <Link className={styles.logout} onClick={() => logout({ returnTo: window.location.origin })}>
                    <SignOutIcon style={{ fontSize: '24px', paddingRight: '8px' }} /> Sign Out</Link>
            </AntLayout.Sider>
            <AntLayout className="site-layout">
                {pageHeader}
                <AntLayout.Content className={styles.pageContent}>
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    )
};

export default Layout;
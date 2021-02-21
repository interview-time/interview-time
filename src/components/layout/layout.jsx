import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Divider, Layout as AntLayout, Menu } from "antd";
import styles from "./layout.module.css";
import {
    CommunityIcon,
    FakeIcon,
    GuideIcon,
    InterviewIcon,
    NewsIcon,
    ProfileIcon,
    QuestionBankIcon,
    SignOutIcon
} from "../utils/icons";
import {
    routeAccount,
    routeCommunity,
    routeInterviews,
    routeNews,
    routeQuestionBank,
    routeQuickstart,
    routeTemplates
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import { isUpdateAvailable } from "../utils/storage";

const menuIconStyle = { fontSize: '24px' }
const menuIconWithBadgeStyle = { fontSize: '24px', position: "absolute" }
const menuIconBadgeStyle = { position: "absolute" }

const Layout = ({ children, pageHeader }) => {

    const location = useLocation();
    const { logout } = useAuth0();

    const getSelectedKey = () => {
        if (location.pathname.includes(routeQuestionBank())) {
            return routeQuestionBank()
        } else if (location.pathname.includes(routeTemplates())) {
            return routeTemplates()
        } else if (location.pathname.includes(routeInterviews())) {
            return routeInterviews()
        } else if (location.pathname.includes(routeAccount())) {
            return routeAccount()
        } else if (location.pathname.includes(routeCommunity())) {
            return routeCommunity()
        } else if (location.pathname.includes(routeNews())) {
            return routeNews()
        }
    }

    const onLogOutClicked = () => {
        logout({ returnTo: window.location.origin })
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

                    <div className={styles.space} />

                    <Menu.Item key={routeNews()} className={styles.menuItem}
                               icon={
                                   <div className={styles.menuIconContainer}>
                                       <NewsIcon style={menuIconWithBadgeStyle} />
                                       <Badge style={menuIconBadgeStyle} offset={[-8, 0]} dot={isUpdateAvailable()}>
                                           <FakeIcon style={menuIconStyle} />
                                       </Badge>
                                   </div>
                                   // </Badge>
                               }>
                        <Link to={routeNews()}>
                            <span className="nav-text">What's new</span>
                        </Link>
                    </Menu.Item>

                    <Menu.Item className={styles.menuItem}
                               icon={<SignOutIcon style={menuIconStyle} />}
                               onClick={onLogOutClicked}>
                        <span className="nav-text">Sign out</span>
                    </Menu.Item>
                </Menu>
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
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Layout as AntLayout, Menu} from "antd";
import styles from "./layout.module.css";
import {
    CandidatesIcon,
    FakeIcon,
    FeedbackIcon,
    GuideIcon,
    InterviewIcon,
    NewsIcon,
    ProfileIcon,
    HomeIcon
} from "../utils/icons";
import {
    routeAccount,
    routeCandidates,
    routeHome,
    routeInterviews,
    routeLibrary,
    routeNews,
    routeQuestionBank,
    routeTemplates
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import {
    isUpdateAvailable
} from "../utils/storage";
import Avatar from "antd/es/avatar/avatar";
import { truncate } from "lodash/string";
import FeedbackModal from "../../pages/feedback/modal-feedback";

const menuIconStyle = { fontSize: '24px' }
const menuIconWithBadgeStyle = { fontSize: '24px', position: "absolute" }
const menuIconBadgeStyle = { position: "absolute" }

const Layout = ({ children, pageHeader, contentStyle }) => {

    const location = useLocation();
    const { user } = useAuth0();

    const [feedbackVisible, setFeedbackVisible] = React.useState(false)

    const getSelectedKey = () => {
        if (location.pathname.includes(routeQuestionBank())) {
            return routeQuestionBank()
        } else if (location.pathname.includes(routeTemplates())) {
            return routeTemplates()
        } else if (location.pathname.includes(routeInterviews())) {
            return routeInterviews()
        } else if (location.pathname.includes(routeAccount())) {
            return routeAccount()
        } else if (location.pathname.includes(routeNews())) {
            return routeNews()
        } else if (location.pathname.includes(routeLibrary())) {
            return routeLibrary()
        }  else if (location.pathname.includes(routeCandidates())) {
            return routeCandidates()
        } else if (location.pathname.includes(routeHome())) {
            return routeHome()
        }
    }

    const getUserName = () => {
        if (user && user.name) {
            return truncate(user.name, {
                'length': 14
            });
        }
        return 'Profile'
    }

    const onFeedbackClicked = () => {
        setFeedbackVisible(true)
    }

    const onFeedbackClose = () => {
        setFeedbackVisible(false)
    }

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <img alt="Interviewer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
                <Menu theme="light"
                      mode="inline"
                      defaultSelectedKeys={[routeHome()]}
                      selectedKeys={[getSelectedKey()]}
                      className={styles.menu}
                >
                    <Menu.Item key={routeHome()} className={styles.menuItem}
                               icon={ <HomeIcon style={menuIconStyle} />}>
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
                    <Menu.Item key={routeCandidates()} className={styles.menuItem}
                               icon={<CandidatesIcon style={menuIconStyle} />}>
                        <Link to={routeCandidates()}>
                            <span className="nav-text">Reports</span>
                        </Link>
                    </Menu.Item>
                    <div className={styles.space} />
                    <Menu.Item key="feedback" className={styles.menuItem}
                               icon={<FeedbackIcon style={menuIconStyle} />}
                               onClick={onFeedbackClicked}>
                        <span className="nav-text">Feedback</span>
                    </Menu.Item>
                    <Menu.Item key={routeNews()} className={styles.menuItem}
                               icon={
                                   <div className={styles.menuIconContainer}>
                                       {/*Badge with icon cause icon to be black, that's why we use fake icon*/}
                                       <NewsIcon style={menuIconWithBadgeStyle} />
                                       <Badge style={menuIconBadgeStyle} offset={[-8, 0]} dot={isUpdateAvailable()}>
                                           <FakeIcon style={menuIconStyle} />
                                       </Badge>
                                   </div>
                               }>
                        <Link to={routeNews()}>
                            <span className="nav-text">What's new</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={routeAccount()} className={styles.menuItem}
                               icon={
                                   <Avatar
                                       src={user ? user.picture : null}
                                       className={styles.avatar}
                                       size={32}
                                       icon={<ProfileIcon />} />
                               }>
                        <Link to={routeAccount()}>
                            <span className="nav-text">{getUserName()}</span>
                        </Link>
                    </Menu.Item>
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

export default Layout;
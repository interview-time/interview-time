import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu} from "antd";
import styles from "./layout.module.css";
import {
    CandidatesIcon,
    FeedbackIcon,
    GuideIcon,
    InterviewIcon,
    ProfileIcon,
    HomeIcon
} from "../utils/icons";
import {
    routeAccount,
    routeReports,
    routeHome,
    routeInterviews,
    routeTemplateNew,
    routeNews,
    routeQuestionBank,
    routeTemplates
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import Avatar from "antd/es/avatar/avatar";
import { truncate } from "lodash/string";
import FeedbackModal from "../../pages/feedback/modal-feedback";

const menuIconStyle = { fontSize: '24px' }
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
        } else if (location.pathname.includes(routeTemplateNew())) {
            return routeTemplateNew()
        }  else if (location.pathname.includes(routeReports())) {
            return routeReports()
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
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge, Drawer, Layout as AntLayout, Menu, Progress } from "antd";
import styles from "./layout.module.css";
import {
    CommunityIcon,
    FakeIcon,
    GuideIcon,
    InterviewIcon,
    NewsIcon,
    ProfileIcon,
    QuestionBankIcon,
} from "../utils/icons";
import {
    routeAccount,
    routeCommunity,
    routeInterviews,
    routeNews,
    routeQuestionBank,
    routeTemplates
} from "../utils/route";

import { useAuth0 } from "../../react-auth0-spa";
import { isQuickstartDisplayed, isUpdateAvailable } from "../utils/storage";
import Avatar from "antd/es/avatar/avatar";
import { truncate } from "lodash/string";
import Text from "antd/lib/typography/Text";
import Quickstart from "../../pages/quickstart/quickstart";
import { shallowEqual, useSelector } from "react-redux";

const menuIconStyle = { fontSize: '24px' }
const menuIconWithBadgeStyle = { fontSize: '24px', position: "absolute" }
const menuIconBadgeStyle = { position: "absolute" }

const Layout = ({ children, pageHeader }) => {

    const location = useLocation();
    const { user } = useAuth0();

    const [quickStartVisible, setQuickStartVisible] = React.useState(
        location.pathname.includes(routeQuestionBank()) && !isQuickstartDisplayed()
    );

    const { guides } = useSelector(state => ({
        guides: state.guides.guides
    }), shallowEqual);

    const { questions } = useSelector(state => ({
        questions: state.questionBank.questions
    }), shallowEqual);

    const { interviews } = useSelector(state => ({
        interviews: state.interviews.interviews,
    }), shallowEqual);

    const tasksCount = 3

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

    const getUserName = () => {
        if (user && user.name) {
            return truncate(user.name, {
                'length': 14
            });
        }
        return 'Profile'
    }

    const onQuickStartClosed = () => {
        setQuickStartVisible(false)
    }

    const onProgressClicked = () => {
        setQuickStartVisible(true)
    }

    const getTaskProgress = () => {
        return (tasksCount - getRemainingTasksCount()) * (100 / tasksCount)
    }

    const getRemainingTasksCount = () => {
        let remainingTasks = 0;
        if (guides.length === 0) {
            remainingTasks++;
        }
        if (questions.length === 0) {
            remainingTasks++;
        }
        if (interviews.length === 0) {
            remainingTasks++;
        }
        return remainingTasks
    }

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <img alt="Interviewer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
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
                    <div className={styles.space} />
                    {getRemainingTasksCount() > 0 && <div
                        className={styles.progressContainer}
                        onClick={onProgressClicked}>
                        <Progress
                            className={styles.progress}
                            type="circle"
                            width={32}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            format={() => getRemainingTasksCount()}
                            strokeWidth={16}
                            percent={getTaskProgress()}
                        />
                        <div className={styles.progressTextContainer}>
                            <Text>Quick start</Text>
                            <Text className={styles.progressTextSecondary}>{getRemainingTasksCount()} Remaining
                                tasks</Text>
                        </div>
                    </div>}
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
                <AntLayout.Content className={styles.pageContent}>
                    <Drawer
                        title="Quick Start"
                        width={700}
                        style={{ marginLeft: 200 }}
                        zIndex={100}
                        closable={true}
                        destroyOnClose={true}
                        onClose={onQuickStartClosed}
                        placement='left'
                        visible={quickStartVisible}>
                        <Quickstart onButtonClicked={onQuickStartClosed} />
                    </Drawer>
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    )
};

export default Layout;
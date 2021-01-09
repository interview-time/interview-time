import React from "react";
import { Divider, Layout as AntLayout, Menu, Space } from "antd";
import { Link } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";
import Text from "antd/es/typography/Text";
import styles from "./layout.module.css";
import { QuestionBankIcon, GuideIcon, InterviewIcon } from "../utils/icons";
import { PoweroffOutlined } from '@ant-design/icons';
import { useAuth0 } from "../../react-auth0-spa";

const menuIconStyle = { fontSize: '24px' }

const Layout = ({ children, pageHeader }) => {
    const { logout } = useAuth0();

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <img alt="Interviewer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
                <Menu theme="light" mode="inline" defaultSelectedKeys={['question-bank']} className={styles.menu}>
                    <Menu.Item key="question-bank" className={styles.menuItem} icon={<QuestionBankIcon style={menuIconStyle} />}>
                        <Link to={`/question-bank`}>
                            <span className="nav-text">Question Bank</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="guides" className={styles.menuItem} icon={<GuideIcon style={menuIconStyle} />}>
                        <Link to={`/guides`}>
                            <span className="nav-text">Guides</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="interviews" className={styles.menuItem} icon={<InterviewIcon style={menuIconStyle} />}>
                        <Link to={`/interviews`}>
                            <span className="nav-text">Interviews</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={() => logout()} className={styles.menuItem} icon={<PoweroffOutlined />}>
                        <span className="nav-text">Logout</span>
                    </Menu.Item>
                </Menu>
                <Divider />
                <Space className={styles.avatar}>
                    <Avatar
                        src='https://cdn.dribbble.com/users/3844750/screenshots/10729124/media/2523facfa3e436b8331c316dcc4998f2.jpg'
                        size="32" />
                    <Text>Kristin Watson</Text>
                </Space>

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
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Divider, Layout as AntLayout, Menu } from "antd";
import styles from "./layout.module.css";
import { GuideIcon, InterviewIcon, ProfileIcon, QuestionBankIcon } from "../utils/icons";
import String from "lodash/string";

const menuIconStyle = { fontSize: '24px' }

const PATH_QUESTION_BANK = `question-bank`;
const PATH_GUIDES = `guides`;
const PATH_INTERVIEWS = `interviews`;
const PATH_ACCOUNT = `account`;

const Layout = ({ children, pageHeader }) => {

    const location = useLocation();

    const getSelectedKey = () => String.split(location.pathname, '/')[1]

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <a href={"/quickstart"}>
                    <img alt="Interviwer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} />
                </a>
                <Menu theme="light"
                      mode="inline"
                      defaultSelectedKeys={[PATH_QUESTION_BANK]}
                      selectedKeys={[getSelectedKey()]}
                      className={styles.menu}
                >
                    <Menu.Item key={PATH_QUESTION_BANK} className={styles.menuItem}
                               icon={<QuestionBankIcon style={menuIconStyle} />}>
                        <Link to={`/${PATH_QUESTION_BANK}`}>
                            <span className="nav-text">Question Bank</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={PATH_GUIDES} className={styles.menuItem} icon={<GuideIcon style={menuIconStyle} />}>
                        <Link to={`/${PATH_GUIDES}`}>
                            <span className="nav-text">Guides</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={PATH_INTERVIEWS} className={styles.menuItem}
                               icon={<InterviewIcon style={menuIconStyle} />}>
                        <Link to={`/${PATH_INTERVIEWS}`}>
                            <span className="nav-text">Interviews</span>
                        </Link>
                    </Menu.Item>
                    <Divider />
                    <Menu.Item key={PATH_ACCOUNT} className={styles.menuItem}
                               icon={<ProfileIcon style={{ fontSize: '20px' }} />}>
                        <Link to={`/${PATH_ACCOUNT}`}>
                            <span className="nav-text">Profile</span>
                        </Link>
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
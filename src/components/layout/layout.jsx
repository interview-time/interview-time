import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Divider, Layout as AntLayout, Menu} from "antd";
import Avatar from "antd/es/avatar/avatar";
import styles from "./layout.module.css";
import {GuideIcon, InterviewIcon, QuestionBankIcon} from "../utils/icons";
import String from "lodash/string";

const menuIconStyle = {fontSize: '24px'}

const PATH_QUESTION_BANK = `question-bank`;
const PATH_GUIDES = `guides`;
const PATH_INTERVIEWS = `interviews`;
const PATH_ACCOUNT = `account`;

const Layout = ({children, pageHeader}) => {

    const location = useLocation();

    const getSelectedKey = () => String.split(location.pathname, '/')[1]

    return (
        <AntLayout className={styles.globalLayout}>
            <AntLayout.Sider theme='light' className={styles.globalSider}>
                <img alt="Interviwer" src={process.env.PUBLIC_URL + '/logo+text.png'} className={styles.logo} alt='Avatar' />
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
                    <Menu.Item key={PATH_ACCOUNT} lassName={styles.menuItem} icon={
                        <Avatar
                            src='https://cdn.dribbble.com/users/3844750/screenshots/10729124/media/2523facfa3e436b8331c316dcc4998f2.jpg'
                            size="24" />
                    }>
                        <Link to={`/${PATH_ACCOUNT}`} style={{marginLeft: '12px'}}>
                            <span className="nav-text">Kristin Watson</span>
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
import React from "react";
import {Layout as AntLayout, Menu} from "antd";
import {Link, withRouter} from "react-router-dom";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DashboardOutlined,
    QuestionOutlined,
    FormOutlined,
    CheckCircleOutlined,
    UserOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';

const Layout = ({children, pageHeader}) => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <AntLayout id="components-layout-demo-custom-trigger" style={{
            height: "100vh"
        }}>
            <AntLayout.Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['question-bank']}>
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="question-bank" icon={<QuestionOutlined />}>
                        <Link to={`/question-bank`}>
                            <span className="nav-text">Question Bank</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FormOutlined />}>
                        Guides
                    </Menu.Item>
                    <Menu.Item key="interviews" icon={<CheckCircleOutlined />}>
                        <Link to={`/interviews`}>
                            <span className="nav-text">Interviews</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        Account
                    </Menu.Item>
                    <Menu.Item key="5" icon={<QuestionCircleOutlined />}>
                        Help
                    </Menu.Item>
                </Menu>
            </AntLayout.Sider>
            <AntLayout className="site-layout">
                <AntLayout.Header className="site-layout-background" style={{padding: 0}}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </AntLayout.Header>
                {pageHeader}
                <AntLayout.Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    )
};

export default Layout;
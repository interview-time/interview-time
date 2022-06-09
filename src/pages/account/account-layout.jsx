import styles from "./account-layout.module.css";
import { Col, Row } from "antd";
import AccountMenu from "./account-menu";
import React from "react";
import Layout from "../../components/layout/layout";
import { connect } from "react-redux";
import { routeProfile } from "../../components/utils/route";
import { useHistory, useLocation } from "react-router-dom";

/**
 *
 * @param {UserProfile} profile
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const AccountLayout = ({ profile, children }) => {
    const history = useHistory();
    const location = useLocation();

    const onProfileClicked = () => {
        history.push(routeProfile());
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <Row gutter={[24, 24]}>
                <Col span={6}>
                    <AccountMenu
                        profile={profile}
                        location={location}
                        onProfileClicked={onProfileClicked}
                    />
                </Col>
                <Col span={18}>{children}</Col>
            </Row>
        </Layout>
    );
};

const mapState = state => {
    const userState = state.user || {};

    return {
        profile: userState.profile,
    };
};

export default connect(mapState)(AccountLayout);

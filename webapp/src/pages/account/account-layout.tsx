import { Col, Row } from "antd";
import AccountMenu from "./account-menu";
import React from "react";
import Layout from "../../components/layout/layout";
import { connect } from "react-redux";
import { routeProfile, routeTeamMembers, routeTeamProfile } from "../../utils/route";
import { useHistory, useLocation } from "react-router-dom";
import TeamMenu from "./team-menu";
import { selectActiveTeam } from "../../store/user/selector";
import { RootState } from "../../store/state-models";
import { UserProfile } from "../../store/models";

type Props = {
    profile?: UserProfile;
    children: JSX.Element[] | JSX.Element;
};

const AccountLayout = ({ profile, children }: Props) => {
    const history = useHistory();
    const location = useLocation();

    const onProfileClicked = () => {
        history.push(routeProfile());
    };

    const onTeamProfileClicked = () => {
        history.push(routeTeamProfile());
    };

    const onTeamClicked = () => {
        history.push(routeTeamMembers());
    };

    return (
        // @ts-ignore
        <Layout>
            <Row gutter={[24, 24]}>
                <Col span={6}>
                    <AccountMenu profile={profile} location={location} onProfileClicked={onProfileClicked} />
                    <TeamMenu
                        team={profile ? selectActiveTeam(profile) : undefined}
                        location={location}
                        onTeamProfileClicked={onTeamProfileClicked}
                        onTeamClicked={onTeamClicked}
                        style={{ marginTop: 24 }}
                    />
                </Col>
                <Col span={18}>{children}</Col>
            </Row>
        </Layout>
    );
};

const mapState = (state: RootState) => {
    const userState = state.user;

    return {
        profile: userState?.profile,
    };
};

export default connect(mapState)(AccountLayout);

import Layout from "../../components/layout/layout";
import { Card, Col, message, Spin, Tabs } from "antd";
import Title from "antd/lib/typography/Title";
import { connect } from "react-redux";
import { SettingOutlined, UserAddOutlined } from "@ant-design/icons";
import TeamDetails from "./team-details";
import TeamMembers from "./team-members";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { loadProfile } from "../../store/user/actions";
import { updateTeam } from "../../store/teams/actions";
import { STATUS_ERROR, STATUS_FINISHED, STATUS_STARTED } from "../../store/common";
import { defaultTo } from "lodash/util";

const { TabPane } = Tabs;

/**
 *
 * @param {UserProfile} profile
 * @param {boolean} loadingProfile
 * @param {string} updateTeamStatus
 * @param loadProfile
 * @param updateTeam
 * @returns {JSX.Element}
 * @constructor
 */
const TeamSettings = ({ profile, loadingProfile, updateTeamStatus, updateTeam, loadProfile }) => {

    const [updateStatus, setUpdateStatus] = useState();
    const [team, setTeam] = useState();

    const location = useLocation();
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        if (profile) {
            const teams = defaultTo(profile.teams, []);
            const currentTeam = teams.find(team => team.teamId === id);
            if (!currentTeam) {
                // team not found, this is cached profile, force fetch
                loadProfile(profile.name, profile.email, true)
            } else if(!team) {
                setTeam(currentTeam);
            }
        } else {
            loadProfile()
        }
        // eslint-disable-next-line
    }, [id, profile]);

    useEffect(() => {
        const newStatus = updateTeamStatus;
        const prevStatus = updateStatus;

        if (prevStatus === STATUS_STARTED && newStatus === STATUS_FINISHED) {
            message.success("Team name has been changed.")
        } else if (prevStatus === STATUS_STARTED && newStatus === STATUS_ERROR) {
            message.error("Team name has been changed.")
        }
        setUpdateStatus(updateTeamStatus)

        // eslint-disable-next-line
    }, [updateTeamStatus]);

    /**
     *
     * @returns {string|null}
     */
    const getTabParam = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab");
    };

    const getTeamName = () => team ? team.teamName : "Team"

    const onSaveClicked = (teamName) => {
        // TODO only allow admin & disable buttons
        const newTeam = {
            ...team,
            teamName: teamName
        };
        updateTeam(newTeam)
        setTeam(newTeam)
    }

    const onDeleteClicked = () => {
        // TODO only allow admin & disable buttons
        console.log("onDeleteClicked")
        message.success(`Team '${getTeamName()}' has been removed.`)
        history.push("/")
    }

    const isLoading = () => loadingProfile || updateStatus === STATUS_STARTED

    return (
        <Layout>
            <Col span={24} xl={{ span: 12, offset: 6 }} xxl={{ span: 12, offset: 6 }}>

                <Spin spinning={isLoading()} tip="Loading...">
                    <Card style={{ marginTop: 12 }}>
                        <Title level={4}>{getTeamName()}</Title>
                        <Tabs defaultActiveKey={getTabParam()}>
                            <TabPane
                                tab={<span><SettingOutlined /> Settings </span>}
                                key="settings"
                            >
                                <TeamDetails
                                    teamName={getTeamName()}
                                    onSaveClicked={onSaveClicked}
                                    onDeleteClicked={onDeleteClicked}
                                />
                            </TabPane>
                            <TabPane
                                tab={<span><UserAddOutlined /> Members</span>}
                                key="members"
                            >
                                <TeamMembers
                                    teamName={getTeamName()}
                                    userName={profile.name}
                                    token={team ? team.token : null} />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Spin>
            </Col>
        </Layout>
    );
}

const mapDispatch = { updateTeam, loadProfile };

const mapState = (state) => {
    const userState = state.user || {};
    const teamState = state.team || {};

    return {
        profile: userState.profile,
        loadingProfile: userState.loading,
        updateTeamStatus: teamState.updateTeamStatus,
    };
};

export default connect(mapState, mapDispatch)(TeamSettings)
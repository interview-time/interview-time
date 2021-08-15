import Layout from "../../components/layout/layout";
import { Card, Col, message, Spin, Tabs } from "antd";
import Title from "antd/lib/typography/Title";
import { connect } from "react-redux";
import { SettingOutlined, UserAddOutlined } from "@ant-design/icons";
import TeamDetails from "./team-details";
import TeamMembers from "./team-members";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { deleteTeam, loadProfile, updateTeam } from "../../store/user/actions";
import { defaultTo } from "lodash/util";
import { TEAM_ROLE_ADMIN } from "../../store/model";

const { TabPane } = Tabs;

/**
 *
 * @param {String} userName
 * @param {Team[]} teams
 * @param loadProfile
 * @param updateTeam
 * @param deleteTeam
 * @returns {JSX.Element}
 * @constructor
 */
const TeamSettings = ({ userName, teams, loadProfile, updateTeam, deleteTeam }) => {

    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState();

    const location = useLocation();
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        if (teams.length === 0) {
            loadProfile()
        } else {
            const currentTeam = teams.find(team => team.teamId === id);
            if (currentTeam) {
                setTeam(currentTeam);
                setLoading(false)
            }
        }
        // eslint-disable-next-line
    }, [id, teams]);

    /**
     *
     * @returns {string|null}
     */
    const getTabParam = () => {
        const params = new URLSearchParams(location.search);
        return params.get("tab");
    };

    const getTeamName = () => team ? team.teamName : "Team"

    const isAdmin = () => team ? team.role === TEAM_ROLE_ADMIN : false

    const onSaveClicked = (teamName) => {
        const newTeam = {
            ...team,
            teamName: teamName
        };
        setLoading(true)
        updateTeam(newTeam)
    }

    const onDeleteClicked = () => {
        deleteTeam(team.teamId)
        message.success(`Team '${getTeamName()}' has been removed.`)
        history.push("/")
    }

    const isLoading = () => !team || loading

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
                                    isAdmin={isAdmin()}
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
                                    userName={userName}
                                    token={team ? team.token : null} />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Spin>
            </Col>
        </Layout>
    );
}

const mapDispatch = { updateTeam, deleteTeam, loadProfile };

const mapState = (state) => {
    const userState = state.user || {};
    const profile = userState.profile || {}

    return {
        userName: profile.name,
        teams: defaultTo(profile.teams, [])
    };
};

export default connect(mapState, mapDispatch)(TeamSettings)
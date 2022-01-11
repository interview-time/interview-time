import Layout from "../../components/layout/layout";
import { message, Table, Tag } from "antd";
import Title from "antd/lib/typography/Title";
import { connect } from "react-redux";
import TeamDetails from "./team-details";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteTeam, leaveTeam, loadProfile, loadTeamMembers, updateTeam } from "../../store/user/actions";
import { defaultTo } from "lodash/util";
import { TEAM_ROLE_ADMIN } from "../../store/model";
import Spinner from "../../components/spinner/spinner";
import styles from "./team-settings.module.css";
import TeamInvite from "./team-invite";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Role",
        key: "role",
        render: (member) => member.roles.map((role) => <Tag>{role}</Tag>),
    },
];

/**
 *
 * @param {String} userName
 * @param {Team[]} teams
 * @param {TeamMembers[]} teamMembers
 * @param loadProfile
 * @param updateTeam
 * @param deleteTeam
 * @param leaveTeam
 * @param loadTeamMembers
 * @returns {JSX.Element}
 * @constructor
 */
const TeamSettings = ({
    userName,
    teams,
    teamMembers,
    loadProfile,
    updateTeam,
    deleteTeam,
    leaveTeam,
    loadTeamMembers
}) => {

    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState();

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
                loadTeamMembers(currentTeam.teamId)
            }
        }
        // eslint-disable-next-line
    }, [id, teams]);

    const getTeamName = () => team ? team.teamName : "Team"

    const isAdmin = () => team ? team.roles.some((role) => role === TEAM_ROLE_ADMIN) : false

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

    const onLeaveClicked = () => {
        leaveTeam(team.teamId)
        message.success(`You left '${getTeamName()}' team.`)
        history.push("/")
    }

    const isLoading = () => !team || loading

    return (
        <Layout contentStyle={styles.rootContainer}>
            {!isLoading() ? <div>
                <Title level={4} style={{ marginBottom: 0 }}>Team settings</Title>

                <div className={styles.card} style={{ marginTop: 12 }}>
                    <TeamDetails
                        teamName={getTeamName()}
                        isAdmin={isAdmin()}
                        onSaveClicked={onSaveClicked}
                        onDeleteClicked={onDeleteClicked}
                        onLeaveClicked={onLeaveClicked}
                    />
                </div>

                <Title level={5} style={{ marginBottom: 0, marginTop: 32 }}>Your team members</Title>

                <div className={styles.card} style={{ padding: 0, marginTop: 12 }}>
                    <Table
                        columns={columns}
                        dataSource={teamMembers}
                        pagination={false}
                    />

                </div>

                <Title level={5} style={{ marginBottom: 0, marginTop: 32 }}>Invite your team</Title>

                <div className={styles.card} style={{ marginTop: 12 }}>
                    <TeamInvite
                        teamName={getTeamName()}
                        userName={userName}
                        token={team ? team.token : null} />
                </div>

            </div> : <Spinner />}

        </Layout>
    );
}

const mapDispatch = { updateTeam, deleteTeam, loadProfile, leaveTeam, loadTeamMembers };

const mapState = (state) => {
    const userState = state.user || {};
    const profile = userState.profile || {}
    const teamMembers = userState.teamMembers || []

    return {
        userName: profile.name,
        teams: defaultTo(profile.teams, []),
        teamMembers: teamMembers
    };
};

export default connect(mapState, mapDispatch)(TeamSettings)
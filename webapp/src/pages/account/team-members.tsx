import React, { useEffect } from "react";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import AccountLayout from "./account-layout";
import { Typography } from "antd";
import { selectActiveTeam } from "../../store/user/selector";
import { isTeamAdmin } from "../../store/user/permissions";
import TeamInvite from "./team-members-invite";
import { useHistory } from "react-router-dom";
import styles from "./team-members.module.css";
import { Button, Modal, Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Roles } from "../../utils/constants";
import TeamRoleTag from "../../components/tags/team-role-tags";
import { TeamMembersTable } from "./team-members-table";
import { loadTeam, cancelInvite } from "../../store/team/actions";
import TeamMembersPendingInvites from "./team-members-pending-invites";
import Spinner from "../../components/spinner/spinner";
import { changeRole, removeMember } from "../../store/user/actions";
import { Team, TeamDetails } from "../../store/models";
import { RootState } from "../../store/state-models";

const { Title, Text } = Typography;

type Props = {
    userId: string;
    team?: Team;
    teamDetails?: TeamDetails;
    loading: boolean;
    loadTeam: any;
    removeMember: any;
    changeRole: any;
    cancelInvite: any;
};

const TeamMembers = ({
    userId,
    team,
    teamDetails,
    loading,
    loadTeam,
    removeMember,
    changeRole,
    cancelInvite,
}: Props) => {
    const isAdmin = team ? isTeamAdmin(team) : false;
    const history = useHistory();

    useEffect(() => {
        if (team) {
            loadTeam(team.teamId);
        }

        // eslint-disable-next-line
    }, [team]);

    const rolesInfoDialog = () => {
        const data = [
            {
                role: Roles.ADMIN,
                text: "Same as Hiring Manager plus can manage its team.",
            },
            {
                role: Roles.RECRUITER,
                text: "Can view all interviews and assign new interviews to others.",
            },
            {
                role: Roles.HIRING_MANAGER,
                text: "Can view all interviews and assign new interviews to others.",
            },
            {
                role: Roles.INTERVIEWER,
                text: "Can view and run interviews assigned to them.",
            },
        ];

        Modal.info({
            title: "Roles permissions",
            width: 800,
            content: (
                <Space direction='vertical'>
                    {data.map(item => (
                        <div>
                            <TeamRoleTag role={item.role} />
                            <Text>- {item.text}</Text>
                        </div>
                    ))}
                </Space>
            ),
            onOk() {},
        });
    };

    const showDeleteDialog = (memberId: string, memberName: string) => {
        Modal.confirm({
            title: "Remove member",
            content: `Are you sure you want to remove ${memberName} from your team ${team?.teamName}?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                removeMember(memberId, team?.teamId);
            },
        });
    };

    const onChangeRoleClicked = (userId: string, key: string) => {
        changeRole(userId, team?.teamId, key);
    };

    return (
        <AccountLayout>
            {teamDetails ? (
                <>
                    {isAdmin && (
                        <Card style={{ marginBottom: 32 }}>
                            <Title level={4} style={{ marginBottom: 20 }}>
                                Team
                            </Title>

                            <TeamInvite />
                        </Card>
                    )}
                    <div className={styles.divSpaceBetween}>
                        <Title level={5} style={{ marginBottom: 0 }}>
                            Your team members
                        </Title>
                        <Button
                            type='text'
                            className={styles.rolesButton}
                            onClick={rolesInfoDialog}
                            icon={<InfoCircleOutlined />}
                        >
                            Roles permissions
                        </Button>
                    </div>
                    <TeamMembersTable
                        teamMembers={teamDetails?.teamMembers ?? []}
                        loading={loading}
                        isAdmin={isAdmin}
                        onRemoveClicked={showDeleteDialog}
                        onChangeRoleClicked={onChangeRoleClicked}
                    />

                    {teamDetails && team && teamDetails.pendingInvites && teamDetails.pendingInvites.length > 0 && (
                        <TeamMembersPendingInvites
                            userId={userId}
                            team={team}
                            pendingInvites={teamDetails.pendingInvites}
                            loading={loading}
                            onCancelInviteClicked={cancelInvite}
                        />
                    )}
                </>
            ) : (
                <Spinner />
            )}
        </AccountLayout>
    );
};

const mapDispatch = { loadTeam, removeMember, changeRole, cancelInvite };

const mapState = (state: RootState) => {
    const profile = state.user.profile;
    const team = state.team;

    return {
        userId: profile.userId,
        team: selectActiveTeam(profile),
        teamDetails: team.details,
        loading: team.loading,
    };
};

export default connect(mapState, mapDispatch)(TeamMembers);

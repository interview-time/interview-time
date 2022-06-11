import React, { useEffect } from "react";
import Layout from "../../components/layout/layout";
import { Button, message, Modal, Space, Table, Menu, Dropdown } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { connect } from "react-redux";
import TeamDetails from "./team-details";
import { useHistory, useParams } from "react-router-dom";
import { deleteTeam, leaveTeam, loadTeamMembers, updateTeam, changeRole, removeMember } from "../../store/user/actions";
import { loadTeam } from "../../store/team/actions";
import { MoreIcon } from "../../utils/icons";
import Alert from "../../components/alert/alert";
import TeamInvite from "../account/team-members-invite";
import Card from "../../components/card/card";
import TeamRoleTag from "../../components/tags/team-role-tags";
import TableHeader from "../../components/table/table-header";
import { localeCompare } from "../../utils/comparators";
import TableText from "../../components/table/table-text";
import { InfoCircleOutlined } from "@ant-design/icons";
import { DisplayRoles, Roles } from "../../utils/constants";
import TeamMembersPendingInvites from "../account/team-members-pending-invites";
import Text from "antd/lib/typography/Text";
import { SubscriptionPlans } from "../../utils/constants";
import styles from "./team-settings.module.css";

/**
 *
 * @param {String} userName
 * @param updateTeam
 * @param deleteTeam
 * @param leaveTeam
 * @param changeRole
 * @param removeMember
 * @param loadTeam
 * @param {boolean} loading
 * @returns {JSX.Element}
 * @constructor
 */
const TeamSettings = ({
    userName,
    updateTeam,
    deleteTeam,
    leaveTeam,
    changeRole,
    removeMember,
    loadTeam,
    team,
    loading,
}) => {
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        console.log(`id: ${id}`);
        if (id) {
            loadTeam(id);
        }
        // eslint-disable-next-line
    }, [id]);

    const isAdmin = () => (team ? team.roles.some(role => role === Roles.ADMIN) : false);

    const onSaveClicked = teamName => {
        const newTeam = {
            ...team,
            teamName: teamName,
        };

        updateTeam(newTeam);
    };

    const onDeleteClicked = () => {
        deleteTeam(team.teamId);
        message.success(`Team '${team.teamName}' has been removed.`);
        history.push("/");
    };

    const onLeaveClicked = () => {
        leaveTeam(team.teamId);
        message.success(`You left '${team.teamName}' team.`);
        history.push("/");
    };

    function rolesInfoDialog() {
        const data = [
            {
                role: Roles.ADMIN,
                text: "Same as Hiring Manager plus can manage its team.",
            },
            {
                role: Roles.HR,
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
    }

    const showDeleteDialog = (memberId, memberName) => {
        Modal.confirm({
            title: "Remove member",
            content: `Are you sure you want to remove ${memberName} from your team ${team.teamName}?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                removeMember(memberId, team.teamId);
            },
        });
    };

    const createMenu = teamMember => (
        <Menu mode='vertical'>
            <Menu.SubMenu key='role' title='Update Roles'>
                {Object.entries(DisplayRoles).map(([key, value]) => (
                    <Menu.Item
                        onClick={e => {
                            e.domEvent.stopPropagation();
                            changeRole(teamMember.userId, team.teamId, key);
                        }}
                        key={key}
                    >
                        <div className={styles.roleItem}>
                            {value}
                            <span className={styles.hasRole}>
                                {teamMember.roles.includes(key) && <CheckOutlined />}
                            </span>
                        </div>
                    </Menu.Item>
                ))}
            </Menu.SubMenu>

            <Menu.Item
                key='remove'
                danger
                onClick={e => {
                    e.domEvent.stopPropagation();
                    showDeleteDialog(teamMember.userId, teamMember.name);
                }}
            >
                Remove
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <TableHeader>NAME</TableHeader>,
            dataIndex: "name",
            key: "name",
            render: name => <TableText className={`fs-mask`}>{name}</TableText>,
        },
        {
            title: <TableHeader>EMAIL</TableHeader>,
            dataIndex: "email",
            key: "email",
            render: email => <TableText className={`fs-mask`}>{email}</TableText>,
        },
        {
            title: <TableHeader>ROLE</TableHeader>,
            key: "role",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.roles[0], b.roles[0]),
            render: member => <TeamRoleTag role={member.roles[0]} />,
        },
        isAdmin()
            ? {
                  key: "actions",
                  render: teamMember =>
                      !teamMember.roles.includes(Roles.ADMIN) && (
                          <Dropdown overlay={createMenu(teamMember)} placement='bottomLeft'>
                              <Button
                                  icon={<MoreIcon />}
                                  style={{ width: 36, height: 36 }}
                                  onClick={e => e.stopPropagation()}
                              />
                          </Dropdown>
                      ),
              }
            : undefined,
    ].filter(column => column);

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                {team && team.plan === SubscriptionPlans.Starter && (
                    <Alert
                        title={`${team.seats}/${team.seats} seats used`}
                        subtitle={`If you want to have more than ${team.seats} users on your team you need to upgrade your plan`}
                        ctaText='Upgrade to Premium'
                    />
                )}

                {team && team.plan === SubscriptionPlans.Premium && (
                    <Alert
                        title={`${team.seats}/${team.seats} seats used`}
                        subtitle={`If you want to have more than ${team.seats} users on your team you need to purchase more seats`}
                        ctaText='Buy More Seats'
                    />
                )}

                <Title level={4} style={{ marginBottom: 0 }}>
                    Team settings
                </Title>

                <Card style={{ marginTop: 12 }}>
                    <TeamDetails
                        teamName={team?.teamName}
                        isAdmin={isAdmin()}
                        onSaveClicked={onSaveClicked}
                        onDeleteClicked={onDeleteClicked}
                        onLeaveClicked={onLeaveClicked}
                    />
                </Card>

                <div className={styles.divSpaceBetween} style={{ marginTop: 32 }}>
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

                <Card withPadding={false} style={{ marginTop: 12 }}>
                    <Table columns={columns} dataSource={team?.teamMembers} pagination={false} loading={loading} />
                </Card>

                {team && team.pendingInvites && team.pendingInvites.length > 0 && (
                    <TeamMembersPendingInvites pendingInvites={team?.pendingInvites} loading={loading} />
                )}

                {isAdmin() && (
                    <>
                        <Title level={5} style={{ marginBottom: 0, marginTop: 32 }}>
                            Invite your team
                        </Title>

                        <Card style={{ marginTop: 12 }}>
                            <TeamInvite teamName={team.teamName} userName={userName} token={team ? team.token : null} />
                        </Card>
                    </>
                )}
            </div>
        </Layout>
    );
};

const mapDispatch = {
    updateTeam,
    deleteTeam,
    leaveTeam,
    loadTeamMembers,
    changeRole,
    removeMember,
    loadTeam,
};

const mapState = state => {
    const userState = state.user || {};
    const profile = userState.profile || {};

    return {
        userName: profile.name,
        team: state.team.details,
        loading: state.team.loading,
    };
};

export default connect(mapState, mapDispatch)(TeamSettings);

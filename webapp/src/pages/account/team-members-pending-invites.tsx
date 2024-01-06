import React from "react";
import { Button, Dropdown, Menu, Table } from "antd";
import { Typography } from "antd";
import Card from "../../components/card/card";
import TeamRoleTag from "../../components/tags/team-role-tags";
import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import { getFormattedDateTime } from "../../utils/date-fns";
import { ColumnsType } from "antd/lib/table";
import { TeamInvite, Team } from "../../store/models";
import { isInElevatedRole, canCancelInvite } from "../../store/user/permissions";
import { MoreIcon } from "../../utils/icons";
import styles from "./team-members.module.css";

const { Title } = Typography;

type Props = {
    userId: string;
    team: Team;
    pendingInvites: TeamInvite[];
    loading: boolean;
    onCancelInviteClicked: any;
};

const TeamMembersPendingInvites = ({ userId, team, pendingInvites, loading, onCancelInviteClicked }: Props) => {
    const createMenu = (invite: TeamInvite) => (
        <Menu mode='vertical'>
            <Menu.Item
                key='cancelInvite'
                onClick={e => {
                    e.domEvent.stopPropagation();
                    onCancelInviteClicked(team.teamId, invite.inviteId);
                }}
            >
                Cancel Invite
            </Menu.Item>
        </Menu>
    );

    const getColumns = (): ColumnsType<TeamInvite> => {
        let columns: ColumnsType<TeamInvite> = [
            {
                title: <TableHeader>EMAIL</TableHeader>,
                dataIndex: "inviteeEmail",
                key: "inviteeEmail",
                render: (inviteeEmail: string) => <TableText>{inviteeEmail}</TableText>,
            },
            {
                title: <TableHeader>ROLE</TableHeader>,
                key: "role",
                dataIndex: "role",
                sortDirections: ["descend", "ascend"],
                render: (role: string) => <TeamRoleTag role={role} />,
            },
            {
                title: <TableHeader>INVITED BY</TableHeader>,
                dataIndex: "invitedBy",
                key: "invitedBy",
                render: (invitedBy: string) => <TableText>{invitedBy}</TableText>,
            },
            {
                title: <TableHeader>INVITED ON</TableHeader>,
                dataIndex: "invitedDate",
                key: "invitedDate",
                sortDirections: ["descend", "ascend"],
                render: (invitedDate: Date) => <TableText>{getFormattedDateTime(invitedDate)}</TableText>,
            },
        ];

        if (isInElevatedRole(team)) {
            columns.push({
                key: "actions",
                render: (invite: TeamInvite) =>
                    canCancelInvite(team.roles, invite.invitedBy === userId) && (
                        // @ts-ignore
                        <Dropdown overlay={createMenu(invite)} placement='bottomLeft' trigger='click'>
                            <Button
                                icon={<MoreIcon />}
                                style={{ width: 36, height: 36 }}
                                onClick={e => e.stopPropagation()}
                            />
                        </Dropdown>
                    ),
            });
        }

        return columns;
    };

    return (
        <>
            <div className={styles.divSpaceBetween} style={{ marginTop: 32 }}>
                <Title level={5} style={{ marginBottom: 0 }}>
                    Pending invites
                </Title>
            </div>

            <Card withPadding={false} style={{ marginTop: 12 }}>
                <Table
                    rowKey='inviteId'
                    columns={getColumns()}
                    dataSource={pendingInvites}
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </>
    );
};

export default TeamMembersPendingInvites;

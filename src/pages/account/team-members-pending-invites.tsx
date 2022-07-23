import React from "react";
import { Table } from "antd";
import Title from "antd/lib/typography/Title";
import Card from "../../components/card/card";
import TeamRoleTag from "../../components/tags/team-role-tags";
import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import { getFormattedDateTime } from "../../utils/date-fns";
import styles from "./team-members.module.css";
import { ColumnsType } from "antd/lib/table";
import { TeamInvite } from "../../store/models";

type Props = {
    pendingInvites: TeamInvite[];
    loading: boolean;
};

const TeamMembersPendingInvites = ({ pendingInvites, loading }: Props) => {
    const columns: ColumnsType<TeamInvite> = [
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
                    columns={columns}
                    dataSource={pendingInvites}
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </>
    );
};

export default TeamMembersPendingInvites;

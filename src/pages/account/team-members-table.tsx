import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import TeamRoleTag from "../../components/tags/team-role-tags";
import { DisplayRoles, Roles } from "../../utils/constants";
import { Button, Dropdown, Menu, Table } from "antd";
import { MoreIcon } from "../../utils/icons";
import React from "react";
import styles from "./team-members.module.css";
import { CheckOutlined } from "@ant-design/icons";
import Card from "../../components/card/card";
import { TeamMember } from "../../store/models";
import { ColumnsType } from "antd/lib/table";

type Props = {
    teamMembers: TeamMember[];
    loading: boolean;
    isAdmin: boolean;
    onRemoveClicked: any;
    onChangeRoleClicked: any;
};

export const TeamMembersTable = ({ teamMembers, loading, isAdmin, onRemoveClicked, onChangeRoleClicked }: Props) => {
    const createMenu = (teamMember: TeamMember) => (
        <Menu mode='vertical'>
            <Menu.SubMenu key='role' title='Update Roles'>
                {Object.entries(DisplayRoles).map(([key, value]) => (
                    <Menu.Item
                        onClick={e => {
                            e.domEvent.stopPropagation();
                            onChangeRoleClicked(teamMember.userId, key);
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
                    onRemoveClicked(teamMember.userId, teamMember.name);
                }}
            >
                Remove
            </Menu.Item>
        </Menu>
    );

    const getColumns = (): ColumnsType<TeamMember> => {
        let columns: ColumnsType<TeamMember> = [
            {
                title: <TableHeader>NAME</TableHeader>,
                dataIndex: "name",
                key: "name",
                render: (name: string) => <TableText className={`fs-mask`}>{name}</TableText>,
            },
            {
                title: <TableHeader>EMAIL</TableHeader>,
                dataIndex: "email",
                key: "email",
                render: (email: string) => <TableText className={`fs-mask`}>{email}</TableText>,
            },
            {
                title: <TableHeader>ROLE</TableHeader>,
                key: "role",
                dataIndex: "roles",
                sortDirections: ["descend", "ascend"],
                // sorter: (a: string[], b: string[]) => localeCompare(a[0], b[0]),
                render: (roles: string[]) => <TeamRoleTag role={roles[0]} />,
            },
        ];

        if (isAdmin) {
            columns.push({
                key: "actions",
                render: (teamMember: TeamMember) =>
                    !teamMember.roles.includes(Roles.ADMIN) && (
                        // @ts-ignore
                        <Dropdown overlay={createMenu(teamMember)} placement='bottomLeft'>
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
        <Card withPadding={false} style={{ marginTop: 12 }}>
            <Table
                rowKey='userId'
                columns={getColumns()}
                dataSource={teamMembers}
                pagination={false}
                loading={loading}
            />
        </Card>
    );
};

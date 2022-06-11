import TableHeader from "../../components/table/table-header";
import TableText from "../../components/table/table-text";
import { localeCompare } from "../../utils/comparators";
import TeamRoleTag from "../../components/tags/team-role-tags";
import { DisplayRoles, Roles } from "../../utils/constants";
import { Button, Dropdown, Menu, Table } from "antd";
import { MoreIcon } from "../../utils/icons";
import React from "react";
import styles from "./team-members.module.css";
import { CheckOutlined } from "@ant-design/icons";
import Card from "../../components/card/card";

/**
 *
 * @param {TeamDetails|undefined} team
 * @param {boolean} loading
 * @param {boolean} isAdmin
 * @returns {JSX.Element}
 * @constructor
 */
export const TeamMembersTable = ({ teamDetails, loading, isAdmin }) => {
    const createMenu = teamMember => (
        <Menu mode='vertical'>
            <Menu.SubMenu key='role' title='Update Roles'>
                {Object.entries(DisplayRoles).map(([key, value]) => (
                    <Menu.Item
                        onClick={e => {
                            e.domEvent.stopPropagation();
                            // changeRole(teamMember.userId, team.teamId, key);
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
                    // showDeleteDialog(teamMember.userId, teamMember.name);
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
        isAdmin
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
        <Card withPadding={false} style={{ marginTop: 12 }}>
            <Table columns={columns} dataSource={teamDetails?.teamMembers ?? []} pagination={false} loading={loading} />
        </Card>
    );
};

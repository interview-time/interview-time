import React, { useEffect } from "react";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import AccountLayout from "./account-layout";
import Title from "antd/lib/typography/Title";
import { selectActiveTeam } from "../../store/user/selector";
import { isTeamAdmin } from "../../store/user/permissions";
import TeamInvite from "./team-members-invite";
import { useHistory } from "react-router-dom";
import styles from "./team-members.module.css";
import { Button, Modal, Space } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Roles } from "../../utils/constants";
import TeamRoleTag from "../../components/tags/team-role-tags";
import Text from "antd/lib/typography/Text";
import { TeamMembersTable } from "./team-members-table";
import { loadTeam } from "../../store/team/actions";
import TeamMembersPendingInvites from "./team-members-pending-invites";
import Spinner from "../../components/spinner/spinner";
import { ErrorIllustration } from "../../utils/illustrations";
import { routeSubscription } from "../../utils/route";

/**
 *
 * @param {UserProfile} profile
 * @param {TeamDetails|undefined} teamDetails
 * @param {boolean} loading
 * @param loadTeam
 * @returns {JSX.Element}
 * @constructor
 */
const TeamMembers = ({ team, teamDetails, loading, loadTeam }) => {
    const isAdmin = isTeamAdmin(team);
    const history = useHistory();

    useEffect(() => {
        loadTeam(team.teamId);

        // eslint-disable-next-line
    }, [team]);

    const rolesInfoDialog = () => {
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
    };

    const onBuyMoreSeatsClicked = () => {
        history.push(routeSubscription());
    };

    return (
        <AccountLayout>
            {!loading && teamDetails ? (
                <>
                    <Card>
                        <Title level={4} style={{ marginBottom: 20 }}>
                            Team
                        </Title>

                        {isAdmin && teamDetails.availableSeats > 0 && <TeamInvite />}

                        {isAdmin && teamDetails.availableSeats <= 0 && (
                            <div className={styles.moreSeatsRoot}>
                                <div className={styles.moreSeatsIllustrationDiv}>
                                    <ErrorIllustration />
                                    <div className={styles.moreSeatsDiv}>
                                        <Text className={styles.moreSeatsTitle}>
                                            Oh no, you can't invite more team members
                                        </Text>
                                        <Text
                                            className={styles.moreSeatsDescription}
                                        >{`If you want to have more than ${teamDetails.seats} users on your team you need to purchase more seats.`}</Text>
                                        <div className={styles.moreSeatsButtonDiv}>
                                            <Button type='primary' onClick={onBuyMoreSeatsClicked}>
                                                Buy More Seats
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                    <TeamMembersTable teamDetails={teamDetails} loading={loading} isAdmin={isAdmin} />

                    {teamDetails && teamDetails.pendingInvites && teamDetails.pendingInvites.length > 0 && (
                        <TeamMembersPendingInvites pendingInvites={teamDetails.pendingInvites} loading={loading} />
                    )}
                </>
            ) : (
                <Spinner />
            )}
        </AccountLayout>
    );
};

const mapDispatch = { loadTeam };

const mapState = state => {
    const userState = state.user || {};

    return {
        team: selectActiveTeam(userState.profile),
        teamDetails: state.team.details,
        loading: state.team.loading,
    };
};

export default connect(mapState, mapDispatch)(TeamMembers);

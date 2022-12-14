import { Button, Card, Col, Divider, Row, Typography } from "antd";
import styles from "./team-join.module.css";
import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { routeHome } from "../../utils/route";
import { setJoinTeam } from "../../utils/storage";
import { Logo } from "../../components/logo/logo";

const { Title, Text, Link, Paragraph } = Typography;
const JoinTeam = () => {
    const { id } = useParams();

    const location = useLocation();
    const history = useHistory();

    /**
     *
     * @returns {string|null}
     */
    const getUserName = () => {
        const params = new URLSearchParams(location.search);
        return params.get("userName");
    };

    /**
     *
     * @returns {string|null}
     */
    const getTeamName = () => {
        const params = new URLSearchParams(location.search);
        return params.get("teamName");
    };

    /**
     *
     * @returns {string|null}
     */
    const getRole = () => {
        const params = new URLSearchParams(location.search);
        return params.get("role");
    };

    const onJoinClicked = () => {
        setJoinTeam({
            token: id,
            role: getRole(),
        });
        history.push(routeHome());
    };

    const getText = () => {
        const userName = getUserName();
        const teamName = getTeamName();

        const userNameComponent = <Text strong>{userName}</Text>;
        const teamNameComponent = <Text strong>{teamName}</Text>;
        const linkComponent = (
            <Link href='https://interviewtime.io' target='_blank'>
                InterviewTime
            </Link>
        );

        if (userName && teamName) {
            return (
                <Paragraph>
                    {userNameComponent} is inviting you to join their team {teamNameComponent} on {linkComponent}
                </Paragraph>
            );
        } else if (userName) {
            return (
                <Paragraph>
                    {userNameComponent} is inviting you to join their team on {linkComponent}
                </Paragraph>
            );
        } else if (teamName) {
            return (
                <Paragraph>
                    {teamNameComponent} is inviting you to join their team on {linkComponent}
                </Paragraph>
            );
        } else {
            return <Paragraph>Invitation to join team on InterviewTime</Paragraph>;
        }
    };

    return (
        <Row className={styles.rootContainer}>
            <Col span={24} xxl={{ span: 8, offset: 8 }} xl={{ span: 8, offset: 8 }} lg={{ span: 12, offset: 6 }}>
                <Card style={{ marginTop: 12 }}>
                    <Logo />
                    <Divider />
                    <Title level={3} style={{ marginTop: 12 }}>
                        Team Invitation
                    </Title>
                    <div style={{ marginTop: 12 }}>{getText()}</div>
                    <Divider />
                    <div className={styles.buttonContainer}>
                        <Button type='primary' onClick={onJoinClicked}>
                            Accept Invitation
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default JoinTeam;

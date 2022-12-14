import styles from "./interview-info-card.module.css";
import React from "react";
import { Interview, TeamMember } from "../../store/models";
import { Typography } from "antd";
import Card from "../card/card";
import { Divider } from "antd";
import { InterviewInfo } from "./interview-info";

const { Title } = Typography;

type Props = {
    interview: Readonly<Interview>;
    interviewers: TeamMember[];
};

export const InterviewInfoCard = ({ interview, interviewers }: Props) => {
    return (
        <Card withPadding={false}>
            <Title level={5} className={styles.title}>
                Interview
            </Title>
            <Divider />
            <div className={styles.content}>
                <InterviewInfo interview={interview} interviewers={interviewers} />
            </div>
        </Card>
    );
};

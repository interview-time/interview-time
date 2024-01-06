import { Space } from "antd";
import styles from "./interview-info.module.css";
import { CalendarIcon, TimeIcon, UsersIcon } from "../../utils/icons";
import { Typography } from "antd";
import { getFormattedDate, getFormattedTimeRange } from "../../utils/date-fns";
import React from "react";
import { Interview, TeamMember } from "../../store/models";
import { interviewWithoutDate } from "../../utils/interview";
const { Text } = Typography;

type Props = {
    interview: Readonly<Interview>;
    interviewers: Readonly<TeamMember[]>;
};

export const InterviewInfo = ({ interview, interviewers }: Props) => {
    const iconStyle = { fontSize: 20, color: "#374151" };

    const interviewersName = interviewers.map(teamMember => teamMember.name).join(", ");

    return (
        <Space direction='vertical' size={12}>
            <div className={styles.divHorizontal}>
                <UsersIcon style={iconStyle} />
                <Text className={styles.reportLabel}>{interviewersName}</Text>
            </div>
            {!interviewWithoutDate(interview) && (
                <div className={styles.divHorizontal}>
                    <CalendarIcon style={iconStyle} />
                    <Text className={styles.reportLabel}>{getFormattedDate(interview.interviewDateTime)}</Text>
                </div>
            )}
            {!interviewWithoutDate(interview) && (
                <div className={styles.divHorizontal}>
                    <TimeIcon style={iconStyle} />
                    <Text className={styles.reportLabel}>
                        {getFormattedTimeRange(interview.interviewDateTime, interview.interviewEndDateTime)}
                    </Text>
                </div>
            )}
        </Space>
    );
};

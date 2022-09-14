import { Space } from "antd";
import styles from "./interview-info.module.css";
import { CalendarIcon, TimeIcon, UsersIcon } from "../../utils/icons";
import Text from "antd/lib/typography/Text";
import { getFormattedDate, getFormattedTimeRange } from "../../utils/date-fns";
import React from "react";
import { Interview, TeamMember } from "../../store/models";

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
            <div className={styles.divHorizontal}>
                <CalendarIcon style={iconStyle} />
                <Text className={styles.reportLabel}>{getFormattedDate(interview.interviewDateTime)}</Text>
            </div>
            <div className={styles.divHorizontal}>
                <TimeIcon style={iconStyle} />
                <Text className={styles.reportLabel}>
                    {getFormattedTimeRange(interview.interviewDateTime, interview.interviewEndDateTime)}
                </Text>
            </div>
        </Space>
    );
};

import React from "react";
import { InterviewStatus } from "../../store/models";
import { TagSuccess, TagWarning, TagDanger, Tag } from "../../assets/styles/global-styles";

type Props = {
    interviewStartDateTime: Date;
    status: InterviewStatus;
};

const InterviewStatusTag = ({ interviewStartDateTime, status }: Props) => {
    const interviewStarted = () => new Date() > interviewStartDateTime;

    if (status === InterviewStatus.SUBMITTED) {
        return <TagSuccess>Complete</TagSuccess>;
    } else if (status === InterviewStatus.COMPLETED) {
        return <TagWarning>Finalizing…</TagWarning>;
    } else if (status === InterviewStatus.CANCELLED) {
        return <TagDanger>Cancelled</TagDanger>;
    } else if (interviewStarted()) {
        return <TagWarning>In Progress</TagWarning>;
    } else {
        return <Tag>Upcoming</Tag>;
    }
};

export default InterviewStatusTag;

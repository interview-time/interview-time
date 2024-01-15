import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { Roles } from "../../utils/constants";

type Props = {
    role: string;
};
const TeamRoleTag = ({ role }: Props) => {
    const getText = () => {
        if (role === Roles.RECRUITER) {
            return "Recruiter";
        } else if (role === Roles.HIRING_MANAGER) {
            return "Hiring Manager";
        } else if (role === Roles.ADMIN) {
            return "Admin";
        } else {
            return "Interviewer";
        }
    };

    return <Tag className={styles.tagGray}>{getText()}</Tag>;
};

export default TeamRoleTag;

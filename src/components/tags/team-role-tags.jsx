import styles from "./status-tags.module.css";
import { Tag } from "antd";
import React from "react";
import { Roles } from "../utils/constants";

/**
 *
 * @param {string} role
 * @returns {JSX.Element}
 * @constructor
 */
const TeamRoleTag = ({ role }) => {
    const getText = () => {
        if (role === Roles.HIRING_MANAGER || role === Roles.HR) { // backward compatibility
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

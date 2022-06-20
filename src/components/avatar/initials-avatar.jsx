import { Avatar, Tooltip } from "antd";
import { getInitials } from "../../utils/string";
import { ProfileIcon } from "../../utils/icons";
import React from "react";

/**
 *
 * @param {string|undefined} interviewerName
 * @returns {JSX.Element}
 * @constructor
 */
const InitialsAvatar = ({ interviewerName }) => {
    return (
        <Tooltip title={interviewerName}>
            <Avatar
                size={32}
                style={{
                    color: "#8C2BE3",
                    backgroundColor: "#F4EAFC",
                    verticalAlign: "middle",
                    fontSize: 14,
                    fontWeight: 500,
                }}
            >
                {interviewerName ? getInitials(interviewerName) : <ProfileIcon />}
            </Avatar>
        </Tooltip>
    );
};

export default InitialsAvatar;

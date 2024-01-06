import React from "react";
import { Popover } from "antd";
import styled from "styled-components";
import { Edit } from "lucide-react";
import IconButton from "./icon-button";

const StyledPopover = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
        color: #7022b6;
    }
`;

const StyledText = styled.span`
    margin-right: 16px;
`;

type Props = {
    icon: any;
    link?: string;
    missingLinkText?: string;
    missingLinkAction?: any;
};

const IconButtonLink = ({ icon, link, missingLinkText, missingLinkAction }: Props) => {
    const openLink = () => {
        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    return !link ? (
        <Popover
            content={
                <StyledPopover onClick={missingLinkAction}>
                    <StyledText>{missingLinkText}</StyledText>
                    <Edit size={20} />
                </StyledPopover>
            }
        >
            <IconButton icon={icon} disabled={true} />
        </Popover>
    ) : (
        <IconButton icon={icon} onClick={openLink} />
    );
};

export default IconButtonLink;

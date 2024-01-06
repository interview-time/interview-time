import React from "react";
import { Popover } from "antd";
import styled from "styled-components";
import CopyClipboard from "../copy-to-clipboard/copy-to-clipboard";
import IconButton from "./icon-button";
import { Edit } from "lucide-react";

const StyledPopover = styled.div`
    display: flex;
    align-items: center;
    ${({ hasMissingText }: StyledPopoverProps) =>
        hasMissingText &&
        `cursor: pointer;
        &:hover {
            color: #7022b6;
        }`}
`;

const StyledText = styled.span`
    margin-right: 16px;
`;

type StyledPopoverProps = {
    hasMissingText?: boolean;
};

type Props = {
    icon: any;
    text?: string;
    missingLinkText?: string;
    missingLinkAction?: any;
};

const IconButtonCopy = ({ icon, text, missingLinkAction, missingLinkText }: Props) => {
    return text ? (
        <Popover
            content={
                <StyledPopover>
                    <StyledText>{text}</StyledText> <CopyClipboard content={text} />
                </StyledPopover>
            }
        >
            <IconButton icon={icon} />
        </Popover>
    ) : (
        <Popover
            content={
                <StyledPopover onClick={missingLinkAction} hasMissingText={missingLinkAction}>
                    <StyledText>{missingLinkText}</StyledText>
                    <Edit size={20} />
                </StyledPopover>
            }
        >
            <IconButton icon={icon} disabled={true} />
        </Popover>
    );
};

export default IconButtonCopy;

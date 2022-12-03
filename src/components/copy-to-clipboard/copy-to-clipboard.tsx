import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, Check } from "lucide-react";
import styled from "styled-components";

type StyledButtonProps = {
    copied: boolean;
};

const StyledButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;   
    cursor: pointer;
    &:hover {
        color: ${({ copied }: StyledButtonProps) => (copied ? "#16A34A" : "#7022b6")};
    }
`;

type Props = {
    content: string;
};

const CopyClipboard = ({ content }: Props) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let timeoutId: any;

        if (copied) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                setCopied(false);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [copied]);

    return (
        <CopyToClipboard text={content} onCopy={() => setCopied(true)}>
            <StyledButton copied={copied}>{copied ? <Check size={20} /> : <Copy size={20} />}</StyledButton>
        </CopyToClipboard>
    );
};

export default CopyClipboard;

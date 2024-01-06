import { Tooltip } from "antd";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
    width: 36px;
    height: 36px;
    background: ${({ disabled }: StyledButtonProps) => (disabled ? "#F9FAFB" : "#ffffff")};
    color: ${({ disabled }: StyledButtonProps) => (disabled ? "#9CA3AF" : "#111827")};
    box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    margin-right: 8px;
    cursor: ${({ disabled }: StyledButtonProps) => (disabled ? "default" : "pointer")};
`;

type StyledButtonProps = {
    disabled?: boolean;
};

type Props = {
    icon: any;
    onClick?: any;
    disabled?: boolean;
    tooltip?: string;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onFocus?: any;
};

const IconButton = ({ icon, disabled, tooltip, onClick, onMouseEnter, onMouseLeave, onFocus }: Props) => {
    return (
        <Tooltip title={tooltip}>
            <StyledButton
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onFocus={onFocus}
            >
                {icon}
            </StyledButton>
        </Tooltip>
    );
};

export default IconButton;

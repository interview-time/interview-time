import styled from "styled-components";
import React from "react";

type Props = {
    children: React.ReactNode;
};

const AntIconSpan = ({ children }: Props) => {
    const Span = styled.span`
        font-size: 18px;
    `;

    return (
        <Span role='img' className='anticon'>
            {children}
        </Span>
    );
};

export default AntIconSpan;

import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Button } from "antd";

export const Content = styled.div`
    margin-top: 64px;
    margin-bottom: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormContainer = styled.div`
    max-width: 600px;
    background-color: ${Colors.Neutral_50};
    margin-top: 32px;
    gap: 24px;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
`;

export const NextButton = styled(Button)`
    align-self: flex-end;
`;

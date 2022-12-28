import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Button, Typography } from "antd";

const { Text } = Typography;

export const TextBold = styled(Text)`
    font-weight: 500;
`;

export const TextExtraBold = styled(Text)`
    font-weight: 600;
`;

export const SecondaryText = styled(Text)`
    color: ${Colors.Neutral_500};
`;

export const SecondaryTextSmall = styled(SecondaryText)`
    font-size: 14px;
`;

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

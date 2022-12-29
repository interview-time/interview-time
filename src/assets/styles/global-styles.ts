import styled from "styled-components";
import { Colors } from "./colors";
import { Typography } from "antd";

const { Text } = Typography;

export const Card = styled.div`
    background-color: white;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
    border-radius: 8px;
`;

export const CardOutlined = styled.div`
    background-color: white;
    border: 1px solid ${Colors.Neutral_200};
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
`;

// MARK: Typography

export const FormLabel = styled(Text)`
    font-weight: 500;
`;
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

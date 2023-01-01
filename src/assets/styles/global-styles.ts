import styled from "styled-components";
import { AccentColors, Colors } from "./colors";
import { Typography } from "antd";

const { Text } = Typography;

// MARK: Cards

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

// MARK: Tags

type TagProps = {
    textColor?: string;
    backgroundColor?: string;
};

export const Tag = styled(Text)`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${(props: TagProps) => props.textColor || Colors.Neutral_600};
    background: ${(props: TagProps) => props.backgroundColor || Colors.Neutral_100};
    padding: 4px 12px;
    gap: 4px;
`;

export const TagSuccess = styled(Tag)`
    color: ${AccentColors.Green_700};
    background: ${AccentColors.Green_100};
`;

export const TagWarning = styled(Tag)`
    color: ${AccentColors.Orange_700};
    background: ${AccentColors.Orange_100};
`;

export const TagDanger = styled(Tag)`
    color: ${AccentColors.Red_700};
    background: ${AccentColors.Red_100};
`;

export const TagSlim = styled(Tag)`
    padding: 4px 8px;
`;

import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Typography } from "antd";
import { CardOutlined } from "../../assets/styles/global-styles";
import { Clipboard, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { Content, FormContainer, NextButton, SecondaryText, SecondaryTextSmall, TextBold } from "./styles";

const { Title } = Typography;

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
`;

type JobCardProps = {
    selected?: boolean;
};

const JobCard = styled(CardOutlined)`
    width: 240px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border: 1px solid ${(props: JobCardProps) => (props.selected ? Colors.Primary_500 : Colors.Neutral_200)};
`;

const IconContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${Colors.Blue_50};
    margin-bottom: 12px;
`;

const IconContainerBlue = styled(IconContainer)`
    background-color: ${Colors.Blue_50};
`;

const IconContainerGreen = styled(IconContainer)`
    background-color: ${Colors.Success_50};
`;

enum Mode {
    BLANK,
    EXISTING,
}

type Props = {
    onNext: () => void;
};

const StepJobType = ({ onNext }: Props) => {
    const [mode, setMode] = useState(Mode.BLANK);

    return (
        <Content>
            <Title level={4}>Create new job</Title>
            <SecondaryText>Please select how do you want to create a new job</SecondaryText>
            <FormContainer>
                <CardContainer>
                    <JobCard onClick={() => setMode(Mode.BLANK)} selected={mode == Mode.BLANK}>
                        <IconContainerBlue>
                            <Clipboard color={Colors.Blue_600} />
                        </IconContainerBlue>
                        <TextBold>Blank</TextBold>
                        <SecondaryTextSmall>Start from scratch</SecondaryTextSmall>
                    </JobCard>
                    <JobCard onClick={() => setMode(Mode.EXISTING)} selected={mode == Mode.EXISTING}>
                        <IconContainerGreen>
                            <ClipboardCopy color={Colors.Success_600} />
                        </IconContainerGreen>
                        <TextBold>Existing</TextBold>
                        <SecondaryTextSmall>Copy information from existing job</SecondaryTextSmall>
                    </JobCard>
                </CardContainer>
                <NextButton type='primary' onClick={onNext}>Next</NextButton>
            </FormContainer>
        </Content>
    );
};

export default StepJobType;

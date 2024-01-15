import { Modal, Typography } from "antd";
import styled from "styled-components";
import { CalendarPlus, FilePlus, UserPlus } from "lucide-react";
import { Colors } from "../../assets/styles/colors";

const { Text } = Typography;

const ActionText = styled(Text)`
    color: ${Colors.Neutral_600};
    font-weight: 500;
    margin-left: 12px;
`;

const IconBackground = styled.div`
    width: 32px;
    height: 32px;
    color: ${Colors.Neutral_600};
    background: ${Colors.Neutral_100};
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

const ActionContainer = styled.div`
    display: flex;
    height: 48px;
    width: 100%;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;
    padding-left: 12px;

    &:hover {
        background-color: ${Colors.Primary_50};

        ${ActionText} {
            color: ${Colors.Primary_500};
        }

        ${IconBackground} {
            color: ${Colors.White};
            background-color: ${Colors.Primary_500};
        }
    }
`;

type Props = {
    open: boolean;
    onClose: any;
    onCreateJob: () => void;
    onScheduleInterview: () => void;
    onAddCandidate: () => void;
    onCreateTemplate: () => void;
};

const ActionsModal = ({ open, onClose, onScheduleInterview, onAddCandidate, onCreateTemplate }: Props) => {
    return (
        <Modal title='Quick Actions' open={open} onCancel={onClose} footer={null} bodyStyle={{ marginTop: 24 }}>
            <ActionContainer onClick={onAddCandidate}>
                <IconBackground>
                    <UserPlus size={20} />
                </IconBackground>
                <ActionText>Add candidate</ActionText>
            </ActionContainer>
            <ActionContainer onClick={onScheduleInterview}>
                <IconBackground>
                    <CalendarPlus size={20} />
                </IconBackground>
                <ActionText>Schedule interview</ActionText>
            </ActionContainer>
            <ActionContainer onClick={onCreateTemplate}>
                <IconBackground>
                    <FilePlus size={20} />
                </IconBackground>
                <ActionText>Create template</ActionText>
            </ActionContainer>
        </Modal>
    );
};

export default ActionsModal;

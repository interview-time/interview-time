import { Modal, Select } from "antd";
import {
    CardOutlined,
    FormLabel,
    SecondaryText,
    SecondaryTextSmall,
    TextBold,
    TextExtraBold,
} from "../../assets/styles/global-styles";
import React, { useState } from "react";
import styled from "styled-components";
import { AccentColors, Colors } from "../../assets/styles/colors";
import { hexToRgb } from "../../utils/colors";
import { Briefcase, Calendar, Contact, MapPin, UserPlus } from "lucide-react";
import { filterOptionLabel } from "../../utils/filters";
import { CandidateDetails } from "../../store/models";
import { getFormattedDateShort } from "../../utils/date-fns";

const CardContainer = styled.div`
    display: flex;
    gap: 24px;
    margin-top: 24px;
    margin-bottom: 24px;
`;

type CandidateTypeCardProps = {
    selected?: boolean;
};

const CandidateTypeCard = styled(CardOutlined)`
    width: 240px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border: 1px solid ${(props: CandidateTypeCardProps) => (props.selected ? Colors.Primary_500 : Colors.Neutral_200)};
`;

const IconContainer = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
`;

const IconContainerBlue = styled(IconContainer)`
    background-color: ${hexToRgb(AccentColors.Blue_500, 0.1)};
`;

const IconContainerGreen = styled(IconContainer)`
    background-color: ${hexToRgb(AccentColors.Green_500, 0.1)};
`;

const ExistingCandidateContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ExistingCandidateFormLabel = styled(FormLabel)`
    margin-bottom: 4px;
`;

const ExistingCandidateCard = styled(CardOutlined)`
    border-color: ${Colors.Primary_500};
    padding: 16px;
    margin-top: 16px;
`;

const ExistingCandidateMetaContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
`;

const ExistingCandidateMetaLabel = styled(SecondaryText)`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
`;

export enum Mode {
    BLANK,
    EXISTING,
}

type Props = {
    candidates: CandidateDetails[];
    open: boolean;
    onSave: (candidateId: string) => void;
    onClose: () => void;
};

const AddCandidateModal = ({ candidates, open, onSave, onClose }: Props) => {
    const [mode, setMode] = useState(Mode.BLANK);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetails | undefined>(undefined);

    const candidateOptions = candidates.map(candidate => ({
        label: candidate.candidateName,
        value: candidate.candidateId,
    }));

    React.useEffect(() => {
        if (open) {
            // reset state to initial
            setMode(Mode.BLANK);
            setSelectedCandidate(undefined);
        }
    }, [open]);

    const handleCandidateSelected = (candidateId: string) => {
        setSelectedCandidate(candidates.find(candidate => candidate.candidateId === candidateId));
    };

    const onSaveClicked = () => {
        if (mode === Mode.EXISTING && selectedCandidate) {
            onSave(selectedCandidate.candidateId);
        }
        // TODO add logic for new candidate when request to create candidate with job id will be ready
    };

    return (
        <Modal
            title='Add Candidate'
            okText='Save'
            cancelText='Cancel'
            okButtonProps={{ disabled: mode === Mode.EXISTING && !selectedCandidate }}
            onOk={onSaveClicked}
            width={600}
            open={open}
            onCancel={onClose}
            destroyOnClose
        >
            <SecondaryText>Please select how do you want to add candidate to this job.</SecondaryText>
            <CardContainer>
                <CandidateTypeCard onClick={() => setMode(Mode.BLANK)} selected={mode === Mode.BLANK}>
                    <IconContainerBlue>
                        <UserPlus color={AccentColors.Blue_500} />
                    </IconContainerBlue>
                    <TextBold>Blank</TextBold>
                    <SecondaryTextSmall>Create new candidate</SecondaryTextSmall>
                </CandidateTypeCard>
                <CandidateTypeCard onClick={() => setMode(Mode.EXISTING)} selected={mode === Mode.EXISTING}>
                    <IconContainerGreen>
                        <Contact color={AccentColors.Green_500} />
                    </IconContainerGreen>
                    <TextBold>Existing</TextBold>
                    <SecondaryTextSmall>Select existing candidate</SecondaryTextSmall>
                </CandidateTypeCard>
            </CardContainer>

            {mode === Mode.EXISTING && (
                <ExistingCandidateContainer>
                    <ExistingCandidateFormLabel>Search for existing candidate</ExistingCandidateFormLabel>
                    <Select
                        showSearch
                        placeholder='Candidate name'
                        options={candidateOptions}
                        onSelect={handleCandidateSelected}
                        filterOption={filterOptionLabel}
                    />
                    {selectedCandidate && (
                        <ExistingCandidateCard>
                            <TextExtraBold>{selectedCandidate.candidateName}</TextExtraBold>
                            <ExistingCandidateMetaContainer>
                                {selectedCandidate.location && (
                                    <ExistingCandidateMetaLabel>
                                        <MapPin size={20} />
                                        {selectedCandidate.location}
                                    </ExistingCandidateMetaLabel>
                                )}
                                {selectedCandidate.position && (
                                    <ExistingCandidateMetaLabel>
                                        <Briefcase size={20} />
                                        {selectedCandidate.position}
                                    </ExistingCandidateMetaLabel>
                                )}
                                <ExistingCandidateMetaLabel>
                                    <Calendar size={20} />
                                    {getFormattedDateShort(selectedCandidate.createdDate)}
                                </ExistingCandidateMetaLabel>
                            </ExistingCandidateMetaContainer>
                        </ExistingCandidateCard>
                    )}
                </ExistingCandidateContainer>
            )}
        </Modal>
    );
};

export default AddCandidateModal;

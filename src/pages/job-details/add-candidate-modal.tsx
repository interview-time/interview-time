import { Button, Modal, Select, Space } from "antd";
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
import { Candidate } from "../../store/models";
import { getFormattedDateShort } from "../../utils/date-fns";
import CreateCandidateForm from "../candidate-add/create-candidate-form";
import { useDispatch } from "react-redux";
import { addCandidateToJob } from "../../store/jobs/actions";

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

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
`;

export enum Mode {
    BLANK,
    EXISTING,
}

type Props = {
    candidates: Candidate[];
    jobId?: string;
    stageId?: string;
    open: boolean;
    onCandidateCreated: () => void;
    onClose: () => void;
};

const AddCandidateModal = ({ candidates, jobId, stageId, open, onCandidateCreated, onClose }: Props) => {
    const dispatch = useDispatch();

    const [mode, setMode] = useState(Mode.EXISTING);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | undefined>(undefined);

    const candidateOptions = candidates
        .filter(candidate => !candidate.jobId && !candidate.archived)
        .map(candidate => ({
            label: candidate.candidateName,
            value: candidate.candidateId,
        }));

    React.useEffect(() => {
        if (open) {
            // reset state to initial
            setMode(Mode.EXISTING);
            setSelectedCandidate(undefined);
        }
    }, [open]);

    const handleCandidateSelected = (candidateId: string) => {
        setSelectedCandidate(candidates.find(candidate => candidate.candidateId === candidateId));
    };

    const onAddExistingCandidate = () => {
        if (mode === Mode.EXISTING && selectedCandidate && jobId && stageId) {
            dispatch(addCandidateToJob(selectedCandidate.candidateId, jobId, stageId));
        }
        onClose();
    };

    return (
        <Modal
            title='Add Candidate'
            width={600}
            open={open}
            onCancel={onClose}
            centered
            destroyOnClose
            bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
            footer={null}
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
                    <Footer>
                        <Space size={8}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type='primary' disabled={!selectedCandidate} onClick={onAddExistingCandidate}>
                                Save
                            </Button>
                        </Space>
                    </Footer>
                </ExistingCandidateContainer>
            )}
            {mode === Mode.BLANK && (
                <CreateCandidateForm
                    stageId={stageId}
                    jobId={jobId}
                    onSave={() => {
                        onCandidateCreated();
                        onClose();
                    }}
                    onCancel={onClose}
                />
            )}
        </Modal>
    );
};

export default AddCandidateModal;

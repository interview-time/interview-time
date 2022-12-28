import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Select, Typography } from "antd";
import {
    CardOutlined,
    FormLabel,
    SecondaryText,
    SecondaryTextSmall, TextBold,
    TextExtraBold
} from "../../assets/styles/global-styles";
import { Calendar, Clipboard, ClipboardCopy, MapPin, Network } from "lucide-react";
import React from "react";
import {
    Content,
    FormContainer,
    NextButton,


} from "./styles";
import { filterOptionLabel } from "../../utils/filters";
import { Job } from "../../store/models";
import { getFormattedDateShort } from "../../utils/date-fns";

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

const ExistingJobContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ExistingJobFormLabel = styled(FormLabel)`
    margin-bottom: 4px;
`;

const ExistingJobCard = styled(CardOutlined)`
    border-color: ${Colors.Primary_500};
    padding: 16px;
    margin-top: 16px;
`;

const ExistingJobMetaContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
`;

const ExistingJobMetaLabel = styled(SecondaryText)`
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
    mode: Mode;
    selectedJob: Job | undefined;
    jobs: Job[];
    onModeChange: (mode: Mode) => void;
    onJobSelected: (job: Job) => void;
    onNext: () => void;
};

const StepJobType = ({ mode, selectedJob, jobs, onModeChange, onJobSelected, onNext }: Props) => {
    const jobsOptions = jobs.map(job => ({
        label: job.title,
        value: job.jobId,
    }));

    const handleJobSelected = (jobId: string) => {
        onJobSelected(jobs.find(job => job.jobId === jobId)!);
    };

    return (
        <Content>
            <Title level={4}>Create new job</Title>
            <SecondaryText>Please select how do you want to create a new job</SecondaryText>
            <FormContainer>
                <CardContainer>
                    <JobCard onClick={() => onModeChange(Mode.BLANK)} selected={mode === Mode.BLANK}>
                        <IconContainerBlue>
                            <Clipboard color={Colors.Blue_600} />
                        </IconContainerBlue>
                        <TextBold>Blank</TextBold>
                        <SecondaryTextSmall>Start from scratch</SecondaryTextSmall>
                    </JobCard>
                    <JobCard onClick={() => onModeChange(Mode.EXISTING)} selected={mode === Mode.EXISTING}>
                        <IconContainerGreen>
                            <ClipboardCopy color={Colors.Success_600} />
                        </IconContainerGreen>
                        <TextBold>Existing</TextBold>
                        <SecondaryTextSmall>Copy information from existing job</SecondaryTextSmall>
                    </JobCard>
                </CardContainer>
                {mode === Mode.EXISTING && (
                    <ExistingJobContainer>
                        <ExistingJobFormLabel>Search for existing job</ExistingJobFormLabel>
                        <Select
                            showSearch
                            placeholder='Job title'
                            options={jobsOptions}
                            defaultValue={selectedJob?.jobId}
                            onSelect={handleJobSelected}
                            filterOption={filterOptionLabel}
                        />
                        {selectedJob && (
                            <ExistingJobCard>
                                <TextExtraBold>{selectedJob.title}</TextExtraBold>
                                <ExistingJobMetaContainer>
                                    {selectedJob.location && (
                                        <ExistingJobMetaLabel>
                                            <MapPin size={20} />
                                            {selectedJob.location}
                                        </ExistingJobMetaLabel>
                                    )}
                                    <ExistingJobMetaLabel>
                                        <Network size={20} />
                                        {selectedJob.department}
                                    </ExistingJobMetaLabel>
                                    <ExistingJobMetaLabel>
                                        <Calendar size={20} />
                                        {getFormattedDateShort(selectedJob.createdDate)}
                                    </ExistingJobMetaLabel>
                                </ExistingJobMetaContainer>
                            </ExistingJobCard>
                        )}
                    </ExistingJobContainer>
                )}
                <NextButton type='primary' onClick={onNext}>
                    Next
                </NextButton>
            </FormContainer>
        </Content>
    );
};

export default StepJobType;

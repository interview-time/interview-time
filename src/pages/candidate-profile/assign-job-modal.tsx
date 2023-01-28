import { Modal, Select } from "antd";
import { Calendar, MapPin, Network } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { CardOutlined, FormLabel, SecondaryText, TextExtraBold } from "../../assets/styles/global-styles";
import { fetchJobs } from "../../store/jobs/actions";
import { selectJobs } from "../../store/jobs/selectors";
import { Job, JobStatus } from "../../store/models";
import { getFormattedDateShort } from "../../utils/date-fns";
import { filterOptionLabel } from "../../utils/filters";

const ExistingJobContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ExistingJobFormLabel = styled(FormLabel)`
    margin-bottom: 4px;
    margin-top: 32px;
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

type Props = {
    open: boolean;
    onAssignJob: (job: Job) => void;
    onClose: () => void;
};

const AssignJobModal = ({ open, onAssignJob, onClose }: Props) => {
    const dispatch = useDispatch();

    const [selectedJob, setSelectedJob] = useState<Job | undefined>();

    const jobs: Job[] = useSelector(selectJobs, shallowEqual);

    const jobsOptions = jobs
        .filter(job => job.status === JobStatus.OPEN)
        .map(job => ({
            label: job.title,
            value: job.jobId,
        }));

    useEffect(() => {
        if (jobs.length === 0) {
            dispatch(fetchJobs());
        }
        // eslint-disable-next-line
    }, []);

    const onJobSelected = (jobId: string) => {
        const job = jobs.find(job => job.jobId === jobId)!;
        setSelectedJob(job);
    };

    return (
        <Modal
            title='Assign to Job'
            okText='Save'
            onOk={() => onAssignJob(selectedJob!)}
            okButtonProps={{
                disabled: selectedJob === undefined,
            }}
            width={600}
            open={open}
            onCancel={onClose}
        >
            <SecondaryText>Select job to assign to this candidate.</SecondaryText>
            <ExistingJobContainer>
                <ExistingJobFormLabel>Search for existing job</ExistingJobFormLabel>
                <Select
                    showSearch
                    placeholder='Job title'
                    options={jobsOptions}
                    onSelect={onJobSelected}
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
        </Modal>
    );
};

export default AssignJobModal;

import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    closeJob,
    deleteJob,
    fetchJobDetails,
    moveCandidateToStage,
    openJob,
    updateJob,
} from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import {
    selectAddCandidateToJobStatus,
    selectCloseJobStatus,
    selectDeleteJobStatus,
    selectGetJobDetailsStatus,
    selectJobDetails,
    selectMoveCandidateToStageStatus,
    selectOpenJobStatus,
    selectUpdateJobStatus,
} from "../../store/jobs/selectors";
import { JobDetails, JobStage, JobStatus } from "../../store/models";
import styled from "styled-components";
import TabInterviews from "./tab-interviews";
import TabPipeline from "./tab-pipeline";
import { Button, message, Select, Spin, Tabs, Typography } from "antd";
import { SecondaryTextSmall } from "../../assets/styles/global-styles";
import Spinner from "../../components/spinner/spinner";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ChevronLeft } from "lucide-react";
import { hashCode } from "../../utils/string";
import { cloneDeep } from "lodash";
import { routeCandidateProfile, routeJobEdit, routeJobs } from "../../utils/route";
import { AccentColors } from "../../assets/styles/colors";
import TabDetails from "./tab-details";
import { selectGetInterviewsStatus } from "../../store/interviews/selector";

const { Option } = Select;
const { Title } = Typography;

const RootLayout = styled.div`
    padding: 32px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 24px;
`;

const HeaderTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ActiveIndicator = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: ${AccentColors.Green_Deep_500};
`;

const ClosedIndicator = styled(ActiveIndicator)`
    background-color: ${AccentColors.Red_500};
`;

const JobStagesContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FlexSpacer = styled.div`
    flex: 1;
`;

const HeaderTitle = styled(Title)`
    && {
        margin-bottom: 0;
    }
`;

const JobDetailsPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams<Record<string, string>>();

    const jobDetailsOriginal: JobDetails | undefined = useSelector(selectJobDetails(id), shallowEqual);

    const updateJobStatus: ApiRequestStatus = useSelector(selectUpdateJobStatus, shallowEqual);
    const closeJobStatus: ApiRequestStatus = useSelector(selectCloseJobStatus, shallowEqual);
    const openJobStatus: ApiRequestStatus = useSelector(selectOpenJobStatus, shallowEqual);
    const deleteJobStatus: ApiRequestStatus = useSelector(selectDeleteJobStatus, shallowEqual);
    const getJobDetailsStatus: ApiRequestStatus = useSelector(selectGetJobDetailsStatus, shallowEqual);
    const addCandidateToJobStatus: ApiRequestStatus = useSelector(selectAddCandidateToJobStatus, shallowEqual);
    const moveCandidateToStageStatus: ApiRequestStatus = useSelector(selectMoveCandidateToStageStatus, shallowEqual);
    const getInterviewsStatus: ApiRequestStatus = useSelector(selectGetInterviewsStatus, shallowEqual);

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    const loadingStatusArr = [
        updateJobStatus,
        closeJobStatus,
        openJobStatus,
        deleteJobStatus,
        getJobDetailsStatus,
        addCandidateToJobStatus,
        moveCandidateToStageStatus,
        getInterviewsStatus,
    ];
    const isLoading = loadingStatusArr.find(s => s === ApiRequestStatus.InProgress) !== undefined;

    useEffect(() => {
        if (jobDetailsOriginal) {
            setJobDetails(jobDetailsOriginal);
        }
    }, [jobDetailsOriginal]);

    useEffect(() => {
        if (jobDetails) {
            if (deleteJobStatus === ApiRequestStatus.Success) {
                message.success(`Job '${jobDetails.title}' removed successfully.`);
                history.push(routeJobs());
            } else if (deleteJobStatus === ApiRequestStatus.Failed) {
                message.error(`Failed to remove job '${jobDetails.title}'.`);
            }
        }
        // eslint-disable-next-line
    }, [deleteJobStatus]);

    useEffect(() => {
        dispatch(fetchJobDetails(id));
        // eslint-disable-next-line
    }, []);

    const onUpdateStages = (stages: JobStage[]) => {
        if (!jobDetails) {
            return;
        }

        const updatedJob = {
            ...jobDetails,
            pipeline: stages,
        };
        setJobDetails(updatedJob);
        dispatch(updateJob(updatedJob));
    };

    const onSaveStage = (stage: JobStage) => {
        if (!jobDetails) {
            return;
        }

        const index = jobDetails.pipeline.findIndex(s => s.stageId === stage.stageId);
        const updatedStages = cloneDeep(jobDetails.pipeline);
        if (index === -1) {
            updatedStages.push(stage);
        } else {
            updatedStages[index] = stage;
        }

        const updatedJob = {
            ...jobDetails,
            pipeline: updatedStages,
        };
        setJobDetails(updatedJob);
        dispatch(updateJob(updatedJob));
    };

    const onRemoveStage = (stage: JobStage) => {
        if (!jobDetails) {
            return;
        }

        const updatedJob = {
            ...jobDetails,
            pipeline: jobDetails.pipeline.filter(s => s.stageId !== stage.stageId),
        };
        setJobDetails(updatedJob);
        dispatch(updateJob(updatedJob));
    };

    const onCandidateMoveStages = (stages: JobStage[], candidateId: string, newStageId: string, position: number) => {
        if (!jobDetails) {
            return;
        }

        const updatedJob = {
            ...jobDetails,
            pipeline: stages,
        };
        setJobDetails(updatedJob);
        dispatch(moveCandidateToStage(jobDetails.jobId, newStageId, candidateId, position));
    };

    const onJobStatusChange = (status: JobStatus) => {
        if (jobDetails) {
            const updatedJob = {
                ...jobDetails,
                status: status,
            };
            setJobDetails(updatedJob);
            if (status === JobStatus.OPEN) {
                dispatch(openJob(jobDetails.jobId));
            } else if (status === JobStatus.CLOSED) {
                dispatch(closeJob(jobDetails.jobId));
            }
        }
    };

    const onJobDetailsUpdated = () => {
        if (jobDetails) {
            dispatch(fetchJobDetails(jobDetails.jobId));
        }
    };

    const onCandidateCardClicked = (candidateId: string) => history.push(routeCandidateProfile(candidateId));

    const onEditJob = () => history.push(routeJobEdit(jobDetails?.jobId));

    const onRemoveJob = () => {
        if (jobDetails) {
            dispatch(deleteJob(jobDetails.jobId));
        }
    };

    const onBackClicked = () => history.goBack();

    const createHeaderSubtitle = (jobDetails: JobDetails) => {
        let subtitle = `#${hashCode(jobDetails.jobId)}`;
        if (jobDetails.location) {
            subtitle += `, ${jobDetails.location}`;
        }
        return subtitle;
    };

    if (!jobDetails) {
        return <Spinner />;
    }

    return (
        <RootLayout>
            <Header>
                <Spin spinning={isLoading}>
                    <Button
                        onClick={onBackClicked}
                        icon={<AntIconSpan>{!isLoading && <ChevronLeft size='1em' />}</AntIconSpan>}
                    />
                </Spin>
                <HeaderTitleContainer>
                    <HeaderTitle level={5}>{jobDetails.title}</HeaderTitle>
                    <SecondaryTextSmall>{createHeaderSubtitle(jobDetails)}</SecondaryTextSmall>
                </HeaderTitleContainer>
                <FlexSpacer />
                <Select
                    placeholder='Job status'
                    value={jobDetails.status}
                    onSelect={(value: JobStatus) => onJobStatusChange(value)}
                >
                    {[
                        <Option key={JobStatus.OPEN} value={JobStatus.OPEN}>
                            <JobStagesContainer>
                                <ActiveIndicator /> Open
                            </JobStagesContainer>
                        </Option>,
                        <Option key={JobStatus.CLOSED} value={JobStatus.CLOSED}>
                            <JobStagesContainer>
                                <ClosedIndicator /> Closed
                            </JobStagesContainer>
                        </Option>,
                    ]}
                </Select>
            </Header>
            <Tabs
                defaultActiveKey='2'
                items={[
                    {
                        label: `Details`,
                        key: "1",
                        children: <TabDetails job={jobDetails} onEditJob={onEditJob} onRemoveJob={onRemoveJob} />,
                    },
                    {
                        label: `Pipeline`,
                        key: "2",
                        children: (
                            <TabPipeline
                                jobId={jobDetails?.jobId}
                                jobStages={jobDetails?.pipeline || []}
                                onUpdateStages={onUpdateStages}
                                onSaveStage={onSaveStage}
                                onRemoveStage={onRemoveStage}
                                onCandidateMoveStages={onCandidateMoveStages}
                                onCandidateCardClicked={onCandidateCardClicked}
                                onCandidateCreated={onJobDetailsUpdated}
                                onInterviewScheduled={onJobDetailsUpdated}
                            />
                        ),
                    },
                    {
                        label: `Interviews`,
                        key: "3",
                        children: <TabInterviews jobDetails={jobDetails} onInterviewRemoved={onJobDetailsUpdated} />,
                    },
                ]}
            />
        </RootLayout>
    );
};

export default JobDetailsPage;

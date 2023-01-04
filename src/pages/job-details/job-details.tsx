import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    addCandidateToJob,
    closeJob,
    fetchJobDetails,
    moveCandidateToStage,
    updateJob,
} from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import {
    selectAddCandidateToJobStatus,
    selectCloseJobStatus,
    selectGetJobDetailsStatus,
    selectJobDetails,
    selectMoveCandidateToStageStatus,
    selectUpdateJobStatus,
} from "../../store/jobs/selectors";
import { CandidateDetails, JobDetails, JobStage, JobStatus, Template } from "../../store/models";
import styled from "styled-components";
import TabPipeline from "./tab-pipeline";
import { Button, Select, Spin, Tabs, Typography } from "antd";
import { SecondaryTextSmall } from "../../assets/styles/global-styles";
import Spinner from "../../components/spinner/spinner";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ChevronLeft } from "lucide-react";
import { hashCode } from "../../utils/string";
import { cloneDeep } from "lodash";
import { selectCandidates } from "../../store/candidates/selector";
import { loadCandidates } from "../../store/candidates/actions";
import { selectTemplates } from "../../store/templates/selector";
import { loadTemplates } from "../../store/templates/actions";
import { routeCandidateProfile } from "../../utils/route";
import { AccentColors } from "../../assets/styles/colors";

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

    const templates: Template[] = useSelector(selectTemplates, shallowEqual);
    const candidates: CandidateDetails[] = useSelector(selectCandidates, shallowEqual);
    const jobDetailsOriginal: JobDetails | undefined = useSelector(selectJobDetails(id), shallowEqual);

    const updateJobStatus: ApiRequestStatus = useSelector(selectUpdateJobStatus, shallowEqual);
    const closeJobStatus: ApiRequestStatus = useSelector(selectCloseJobStatus, shallowEqual);
    const getJobDetailsStatus: ApiRequestStatus = useSelector(selectGetJobDetailsStatus, shallowEqual);
    const addCandidateToJobStatus: ApiRequestStatus = useSelector(selectAddCandidateToJobStatus, shallowEqual);
    const moveCandidateToStageStatus: ApiRequestStatus = useSelector(selectMoveCandidateToStageStatus, shallowEqual);

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    const isUploadingIndicatorVisible =
        updateJobStatus === ApiRequestStatus.InProgress ||
        closeJobStatus === ApiRequestStatus.InProgress ||
        addCandidateToJobStatus === ApiRequestStatus.InProgress ||
        moveCandidateToStageStatus === ApiRequestStatus.InProgress ||
        getJobDetailsStatus === ApiRequestStatus.InProgress;

    useEffect(() => {
        if (jobDetailsOriginal) {
            setJobDetails(jobDetailsOriginal);
        }
    }, [jobDetailsOriginal]);

    useEffect(() => {
        dispatch(fetchJobDetails(id));
        dispatch(loadCandidates());

        if (templates.length === 0) {
            dispatch(loadTemplates());
        }
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

    const onCandidateMoveStages = (stages: JobStage[], candidateId: string, newStageId: string) => {
        if (!jobDetails) {
            return;
        }

        const updatedJob = {
            ...jobDetails,
            pipeline: stages,
        };
        setJobDetails(updatedJob);
        dispatch(moveCandidateToStage(jobDetails.jobId, newStageId, candidateId));
    };

    const onAddCandidate = (candidateId: string, stageId: string) => {
        if (jobDetails) {
            dispatch(addCandidateToJob(jobDetails.jobId, stageId, candidateId));
        }
    };

    const onJobStatusChange = (status: JobStatus) => {
        if (jobDetails) {
            const updatedJob = {
                ...jobDetails,
                status: status,
            };
            setJobDetails(updatedJob);
            dispatch(closeJob(jobDetails.jobId));
        }
        // TODO reopen job?
    };

    const onCandidateCardClicked = (candidateId: string) => history.push(routeCandidateProfile(candidateId));

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
                <Spin spinning={isUploadingIndicatorVisible}>
                    <Button
                        onClick={onBackClicked}
                        icon={<AntIconSpan>{!isUploadingIndicatorVisible && <ChevronLeft size='1em' />}</AntIconSpan>}
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
                        children: `Not implemented yet`,
                    },
                    {
                        label: `Pipeline`,
                        key: "2",
                        children: (
                            <TabPipeline
                                templates={templates}
                                jobStages={jobDetails?.pipeline || []}
                                candidates={candidates}
                                onAddCandidate={onAddCandidate}
                                onUpdateStages={onUpdateStages}
                                onSaveStage={onSaveStage}
                                onRemoveStage={onRemoveStage}
                                onCandidateMoveStages={onCandidateMoveStages}
                                onCandidateCardClicked={onCandidateCardClicked}
                            />
                        ),
                    },
                ]}
            />
        </RootLayout>
    );
};

export default JobDetailsPage;

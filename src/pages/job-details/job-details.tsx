import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addCandidateToJob, fetchJobDetails, moveCandidateToStage, updateJob } from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import {
    selectAddCandidateToJobStatus,
    selectGetJobDetailsStatus,
    selectJobDetails,
    selectMoveCandidateToStageStatus,
    selectUpdateJobStatus,
} from "../../store/jobs/selectors";
import { CandidateDetails, JobDetails, JobStage, Template } from "../../store/models";
import styled from "styled-components";
import TabPipeline from "./tab-pipeline";
import { Button, Spin, Tabs, Typography } from "antd";
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
    const getJobDetailsStatus: ApiRequestStatus = useSelector(selectGetJobDetailsStatus, shallowEqual);
    const addCandidateToJobStatus: ApiRequestStatus = useSelector(selectAddCandidateToJobStatus, shallowEqual);
    const moveCandidateToStageStatus: ApiRequestStatus = useSelector(selectMoveCandidateToStageStatus, shallowEqual);

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    const isUploadingIndicatorVisible =
        updateJobStatus === ApiRequestStatus.InProgress ||
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

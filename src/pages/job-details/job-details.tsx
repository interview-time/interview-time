import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchJobDetails, updateJob } from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { selectJobDetails, selectUpdateJobStatus } from "../../store/jobs/selectors";
import { CandidateStageStatus, JobDetails, JobStage, StageCandidate } from "../../store/models";
import styled from "styled-components";
import TabPipeline from "./tab-pipeline";
import { Button, Spin, Tabs, Typography } from "antd";
import { SecondaryTextSmall } from "../../assets/styles/global-styles";
import Spinner from "../../components/spinner/spinner";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ChevronLeft } from "lucide-react";
import { hashCode } from "../../utils/string";
import { cloneDeep } from "lodash";

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

// TODO mock data
const candidates: StageCandidate[] = [
    {
        candidateId: "1",
        name: "Cameron Williamson",
        position: "Android Developer @ Square",
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "2",
        name: "Jon Doe",
        status: CandidateStageStatus.INTERVIEW_SCHEDULED,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "3",
        name: "Dmytro Danylyk",
        status: CandidateStageStatus.AWAITING_FEEDBACK,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "4",
        name: "Dmytro Danylyk",
        status: CandidateStageStatus.SCHEDULE_INTERVIEW,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "5",
        name: "Dmytro Danylyk",
        status: CandidateStageStatus.FEEDBACK_AVAILABLE,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "6",
        name: "Dmytro Danylyk",
        status: CandidateStageStatus.FEEDBACK_AVAILABLE,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
    {
        candidateId: "7",
        name: "Dmytro Danylyk",
        status: CandidateStageStatus.FEEDBACK_AVAILABLE,
        movedToStage: "2022-07-13T11:15:00Z",
        originallyAdded: "2022-07-13T11:15:00Z",
    },
];

const JobDetailsPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams<Record<string, string>>();

    const jobDetailsOriginal: JobDetails | undefined = useSelector(selectJobDetails(id), shallowEqual);
    const updateJobStatus: ApiRequestStatus = useSelector(selectUpdateJobStatus, shallowEqual);

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    useEffect(() => {
        if (jobDetailsOriginal) {
            jobDetailsOriginal.pipeline[0].candidates = candidates;
            setJobDetails(jobDetailsOriginal);
        }
        // eslint-disable-next-line
    }, [jobDetailsOriginal]);

    // TODO remove when PUT request returns data
    useEffect(() => {
        if (updateJobStatus === ApiRequestStatus.Success) {
            dispatch(fetchJobDetails(id));
        }
    }, [updateJobStatus]);

    useEffect(() => {
        dispatch(fetchJobDetails(id));
        // eslint-disable-next-line
    }, []);

    const onStagesOrderChange = (stages: JobStage[]) => {
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
                <Button
                    onClick={onBackClicked}
                    icon={
                        <AntIconSpan>
                            <ChevronLeft size='1em' />
                        </AntIconSpan>
                    }
                />
                <HeaderTitleContainer>
                    <HeaderTitle level={5}>{jobDetails.title}</HeaderTitle>
                    <SecondaryTextSmall>{createHeaderSubtitle(jobDetails)}</SecondaryTextSmall>
                </HeaderTitleContainer>
                <Spin spinning={updateJobStatus === ApiRequestStatus.InProgress} />
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
                                jobStages={jobDetails?.pipeline || []}
                                onStagesOrderChange={onStagesOrderChange}
                                onSaveStage={onSaveStage}
                                onRemoveStage={onRemoveStage}
                            />
                        ),
                    },
                ]}
            />
        </RootLayout>
    );
};

export default JobDetailsPage;

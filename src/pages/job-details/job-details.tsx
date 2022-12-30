import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchJobDetails } from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/state-models";
import { selectJobDetails } from "../../store/jobs/selectors";
import { StageCandidate, CandidateStageStatus, JobDetails, JobStage } from "../../store/models";
import styled from "styled-components";
import TabPipeline from "./tab-pipeline";
import { Button, Tabs, Typography } from "antd";
import { SecondaryTextSmall } from "../../assets/styles/global-styles";
import Spinner from "../../components/spinner/spinner";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { ChevronLeft } from "lucide-react";
import { hashCode } from "../../utils/string";

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
];

const JobDetailsPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams<Record<string, string>>();

    const jobDetailsOriginal: JobDetails | undefined = useSelector(
        (state: RootState) => selectJobDetails(state, id),
        shallowEqual
    );

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    useEffect(() => {
        if (jobDetailsOriginal) {
            jobDetailsOriginal.pipeline[0].candidates = candidates;
            setJobDetails(jobDetailsOriginal);
        }
        // eslint-disable-next-line
    }, [jobDetailsOriginal]);

    useEffect(() => {
        dispatch(fetchJobDetails(id));
        // eslint-disable-next-line
    }, []);

    const onStagesChange = (stages: JobStage[]) => {
        if (jobDetails) {
            setJobDetails({
                ...jobDetails,
                pipeline: stages,
            });
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
            </Header>
            <Tabs
                defaultActiveKey="2"
                items={[
                    {
                        label: `Details`,
                        key: '1',
                        children: `Not implemented yet`,
                    },
                    {
                        label: `Pipeline`,
                        key: '2',
                        children: <TabPipeline jobStages={jobDetails?.pipeline || []} onStagesChange={onStagesChange} />,
                    },
                ]}
            />
        </RootLayout>
    );
};

export default JobDetailsPage;

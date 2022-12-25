import { Button, Col, Form, Menu, message, Row } from "antd";
import StepJobType from "./step-job-type";
import styled from "styled-components";
import { Briefcase, ChevronLeft, ClipboardType, Cog } from "lucide-react";
import React, { useEffect, useState } from "react";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { Colors } from "../../assets/styles/colors";
import { useHistory } from "react-router-dom";
import StepJobDetails from "./step-job-details";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/state-models";
import { Job, JobDetails, JobStage, TeamMember, UserProfile } from "../../store/models";
import { loadTeam } from "../../store/team/actions";
import { createJob, fetchJobDetails, fetchJobs } from "../../store/jobs/actions";
import StepJobStages from "./step-job-stages";
import { routeJobs } from "../../utils/route";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../utils/log";
import { selectDepartments, selectJobDetails } from "../../store/jobs/selectors";

const MenuContainer = styled.div`
    margin-top: 64px;
`;

const MainMenu = styled(Menu)`
    &&& {
        border: 0;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 160px;
        margin-top: 48px;
    }
`;

const MenuItem = styled(Menu.Item)`
    && {
        display: flex;
        align-items: center;
        font-weight: 500;
        border-radius: 6px;
    }
`;

const BackButton = styled(Button)`
    color: ${Colors.Neutral_500};
`;

const MenuCol = styled(Col)`
    display: flex;
    justify-content: center;
`;

const ContentCol = styled(Col)`
    overflow-y: scroll;
    height: 100vh;
`;

const emptyJob: JobDetails = {
    createdDate: "",
    department: "",
    jobId: uuidv4(),
    newlyAddedCandidates: 0,
    owner: "",
    ownerName: "",
    pipeline: [],
    status: "",
    tags: [],
    title: "",
    totalCandidates: 0,
};

enum Step {
    NEW_JOB = "NEW_JOB",
    DETAILS = "DETAILS",
    STAGES = "STAGES",
}

export enum Mode {
    BLANK,
    EXISTING,
}

type Props = {};

const NewJob = ({}: Props) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [job, setJob] = useState(emptyJob);
    const [mode, setMode] = useState(Mode.BLANK);
    const [selectedJob, setSelectedJob] = useState<Job>();
    const [selectedStep, setSelectedStep] = useState(Step.NEW_JOB);

    const [detailsForm] = Form.useForm();

    const jobs: Job[] = useSelector((state: RootState) => state.jobs.jobs, shallowEqual);
    const jobDetails: JobDetails | undefined = useSelector(
        (state: RootState) => selectJobDetails(state.jobs, selectedJob?.jobId),
        shallowEqual
    );
    // this doesn't scale when we have a lot of jobs
    const departments: string[] = useSelector((state: RootState) => selectDepartments(state.jobs), shallowEqual);
    const profile: UserProfile = useSelector((state: RootState) => state.user.profile, shallowEqual);
    const teamMembers: TeamMember[] = useSelector(
        (state: RootState) => state.team.details?.teamMembers || [],
        shallowEqual
    );

    useEffect(() => {
        if (profile.currentTeamId && teamMembers.length === 0) {
            dispatch(loadTeam(profile.currentTeamId));
        }
    }, [profile]);

    useEffect(() => {
        console.log(jobDetails);
        if (jobDetails) {
            setSelectedJob(jobDetails);
            setJob({
                ...job,
                title: jobDetails.title,
                department: jobDetails.department,
                location: jobDetails.location,
                deadline: jobDetails.deadline,
                tags: jobDetails.tags,
                description: jobDetails.description,
                pipeline: [...jobDetails.pipeline],
            });
        }
    }, [jobDetails]);

    useEffect(() => {
        if (jobs.length === 0) {
            dispatch(fetchJobs());
        }
    }, []);

    const onBackClicked = () => history.push(routeJobs());

    const changeStep = (step: Step) => {
        if (selectedStep === Step.DETAILS) {
            const formValues = detailsForm.getFieldsValue();
            setJob({
                ...job,
                title: formValues.title,
                department: formValues.department,
                location: formValues.location,
                deadline: formValues.date,
                tags: formValues.tags,
                description: formValues.description,
            });
        } else if (selectedStep === Step.STAGES) {
        }
        setSelectedStep(step);
    };

    const onStagesChange = (stages: JobStage[]) => {
        setJob({
            ...job,
            pipeline: stages,
        });
    };

    const onModeChange = (mode: Mode) => {
        if (mode === Mode.BLANK) {
            setSelectedJob(undefined);
            setJob(emptyJob);
        }
        setMode(mode);
    };

    const onJobSelected = (selectedJob: Job) => {
        // populate selected job with data that we have
        setSelectedJob(selectedJob);
        setJob({
            ...job,
            title: selectedJob.title,
            department: selectedJob.department,
            location: selectedJob.location,
        });

        // fetch the rest of the data
        dispatch(fetchJobDetails(selectedJob.jobId));
    };

    const onFinish = () => {
        log("onFinish", job);
        // TODO add validation
        dispatch(createJob(job));
        message.success(`Job '${job.title}' created.`);
        history.push(routeJobs());
    };

    return (
        <Row gutter={[32, 32]}>
            <MenuCol xl={{ span: 5 }} md={{ span: 5 }}>
                <MenuContainer>
                    <BackButton
                        type='text'
                        onClick={onBackClicked}
                        icon={
                            <AntIconSpan>
                                <ChevronLeft size='1em' />
                            </AntIconSpan>
                        }
                    >
                        Back
                    </BackButton>
                    <MainMenu theme='light' mode='vertical' selectedKeys={[selectedStep]}>
                        <MenuItem key={Step.NEW_JOB} onClick={() => changeStep(Step.NEW_JOB)} icon={<Briefcase />}>
                            Job
                        </MenuItem>
                        <MenuItem key={Step.DETAILS} onClick={() => changeStep(Step.DETAILS)} icon={<ClipboardType />}>
                            Details
                        </MenuItem>
                        <MenuItem key={Step.STAGES} onClick={() => changeStep(Step.STAGES)} icon={<Cog />}>
                            Stages
                        </MenuItem>
                    </MainMenu>
                </MenuContainer>
            </MenuCol>
            <ContentCol xl={{ span: 14 }} md={{ span: 19 }}>
                {selectedStep === Step.NEW_JOB && (
                    <StepJobType
                        mode={mode}
                        selectedJob={selectedJob}
                        jobs={jobs}
                        onModeChange={onModeChange}
                        onJobSelected={onJobSelected}
                        onNext={() => changeStep(Step.DETAILS)}
                    />
                )}
                {selectedStep === Step.DETAILS && (
                    <StepJobDetails
                        job={job}
                        profile={profile}
                        form={detailsForm}
                        departments={departments}
                        teamMembers={teamMembers}
                        onNext={() => changeStep(Step.STAGES)}
                    />
                )}
                {selectedStep === Step.STAGES && (
                    <StepJobStages stages={job.pipeline} onStagesChange={onStagesChange} onFinish={onFinish} />
                )}
            </ContentCol>
            <Col xl={{ span: 5 }} md={{ span: 0 }} />
        </Row>
    );
};

export default NewJob;

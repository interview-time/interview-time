import { Button, Col, Form, Menu, message, Row, Spin } from "antd";
import StepJobType, { Mode } from "./step-job-type";
import styled from "styled-components";
import { Briefcase, ChevronLeft, ClipboardType, Cog } from "lucide-react";
import React, { useEffect, useState } from "react";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { Colors } from "../../assets/styles/colors";
import { useHistory, useParams } from "react-router-dom";
import StepJobDetails from "./step-job-details";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { Job, JobDetails, JobStage, JobStatus, TeamMember, Template, UserProfile } from "../../store/models";
import { loadTeam } from "../../store/team/actions";
import { createJob, fetchJobDetails, fetchJobs, updateJob } from "../../store/jobs/actions";
import StepJobStages from "./step-job-stages";
import { canGoBack, routeJobs } from "../../utils/route";
import { v4 as uuidv4 } from "uuid";
import { log } from "../../utils/log";
import {
    selectCreateJobStatus,
    selectDepartments,
    selectJobDetails,
    selectJobs,
    selectUpdateJobStatus,
} from "../../store/jobs/selectors";
import { selectTeamMembers } from "../../store/team/selector";
import { selectUserProfile } from "../../store/user/selector";
import { cloneDeep, isEmpty } from "lodash";
import { selectTemplates } from "../../store/templates/selector";
import { loadTemplates } from "../../store/templates/actions";

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
    status: JobStatus.OPEN,
    tags: [],
    title: "",
    totalCandidates: 0,
};

enum Step {
    NEW_JOB = "NEW_JOB",
    DETAILS = "DETAILS",
    STAGES = "STAGES",
}

const NewJob = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams<Record<string, string | undefined>>();
    const isEditMode = id !== undefined;

    const [detailsForm] = Form.useForm();

    const [job, setJob] = useState(emptyJob);
    const [selectedStep, setSelectedStep] = useState(isEditMode ? Step.DETAILS : Step.NEW_JOB);

    const departments: string[] = useSelector(selectDepartments, shallowEqual);
    const profile: UserProfile = useSelector(selectUserProfile, shallowEqual);
    const teamMembers: TeamMember[] = useSelector(selectTeamMembers, shallowEqual);
    const templates: Template[] = useSelector(selectTemplates, shallowEqual);

    useEffect(() => {
        if (profile.currentTeamId && teamMembers.length === 0) {
            dispatch(loadTeam(profile.currentTeamId));
        }
        // eslint-disable-next-line
    }, [profile]);

    useEffect(() => {
        if (!isEditMode && jobs.length === 0) {
            dispatch(fetchJobs());
        }

        if (isEditMode) {
            dispatch(fetchJobDetails(id));
        }

        if (templates.length === 0) {
            dispatch(loadTemplates());
        }
        // eslint-disable-next-line
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
                deadline: formValues.deadline,
                tags: formValues.tags,
                description: formValues.description,
            });
        }
        setSelectedStep(step);
    };

    const onStagesChange = (stages: JobStage[]) => {
        setJob({
            ...job,
            pipeline: stages,
        });
    };

    const onFinish = () => {
        log("onFinish", job);
        if (isEmpty(job.title)) {
            message.error("Job title is empty. Please enter a job title.");
        } else if (isEmpty(job.department)) {
            message.error("Job department is empty. Please enter a job department.");
        } else if (isEditMode) {
            dispatch(updateJob(job));
        } else {
            dispatch(createJob(job));
        }
    };

    // MARK: Edit job flow
    const editJobDetails: JobDetails | undefined = useSelector(selectJobDetails(id), shallowEqual);
    const updateJobStatus: ApiRequestStatus = useSelector(selectUpdateJobStatus, shallowEqual);

    useEffect(() => {
        if (editJobDetails) {
            setJob(cloneDeep(editJobDetails));
        }
        // eslint-disable-next-line
    }, [editJobDetails]);

    useEffect(() => {
        if (updateJobStatus === ApiRequestStatus.Success) {
            message.success(`Job '${job.title}' updated successfully.`);
            if (canGoBack(history)) {
                history.goBack();
            } else {
                history.push(routeJobs());
            }
        } else if (createJobStatus === ApiRequestStatus.Failed) {
            message.error(`Failed to update job '${job.title}'.`);
            history.push(routeJobs());
        }
        // eslint-disable-next-line
    }, [updateJobStatus]);

    // MARK: New job flow

    const [mode, setMode] = useState(Mode.BLANK);
    const jobs: Job[] = useSelector(selectJobs, shallowEqual);
    const [selectedJob, setSelectedJob] = useState<Job>();
    const selectedJobDetails: JobDetails | undefined = useSelector(selectJobDetails(selectedJob?.jobId), shallowEqual);
    const createJobStatus: ApiRequestStatus = useSelector(selectCreateJobStatus, shallowEqual);

    useEffect(() => {
        if (selectedJobDetails) {
            setSelectedJob(selectedJobDetails);
            setJob({
                ...job,
                title: selectedJobDetails.title,
                department: selectedJobDetails.department,
                location: selectedJobDetails.location,
                deadline: selectedJobDetails.deadline,
                tags: selectedJobDetails.tags,
                description: selectedJobDetails.description,
                pipeline: [...selectedJobDetails.pipeline],
            });
        }
        // eslint-disable-next-line
    }, [selectedJobDetails]);

    useEffect(() => {
        if (createJobStatus === ApiRequestStatus.Success) {
            message.success(`Job '${job.title}' created successfully.`);
            dispatch(fetchJobs(true));
            history.push(routeJobs());
        } else if (createJobStatus === ApiRequestStatus.Failed) {
            message.error(`Failed to create job '${job.title}'.`);
        }
        // eslint-disable-next-line
    }, [createJobStatus]);

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

    const StepNewJobComponent = () => (
        <StepJobType
            mode={mode}
            selectedJob={selectedJob}
            jobs={jobs}
            onModeChange={onModeChange}
            onJobSelected={onJobSelected}
            onNext={() => changeStep(Step.DETAILS)}
        />
    );

    const NewJobMenuItem = () => (
        <MenuItem key={Step.NEW_JOB} onClick={() => changeStep(Step.NEW_JOB)} icon={<Briefcase />}>
            Job
        </MenuItem>
    );

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
                        {!isEditMode && NewJobMenuItem()}
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
                {selectedStep === Step.NEW_JOB && !isEditMode && StepNewJobComponent()}
                <Spin spinning={isEditMode && !editJobDetails}>
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
                </Spin>
                {selectedStep === Step.STAGES && (
                    <StepJobStages
                        stages={job.pipeline}
                        templates={templates}
                        buttonLoading={
                            createJobStatus === ApiRequestStatus.InProgress ||
                            updateJobStatus === ApiRequestStatus.InProgress
                        }
                        onStagesChange={onStagesChange}
                        onFinish={onFinish}
                    />
                )}
            </ContentCol>
            <Col xl={{ span: 5 }} md={{ span: 0 }} />
        </Row>
    );
};

export default NewJob;

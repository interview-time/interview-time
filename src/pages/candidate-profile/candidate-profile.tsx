import { Col } from "antd";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import LayoutWide from "../../components/layout-wide/layout-wide";
import Spinner from "../../components/spinner/spinner";
import {
    archiveCandidate,
    fetchCandidateDetails,
    restoreArchivedCandidate,
    updateCandidate,
} from "../../store/candidates/actions";
import { selectCandidateDetails, selectGetCandidateDetailsStatus } from "../../store/candidates/selector";
import { addCandidateToJob } from "../../store/jobs/actions";
import { selectAddCandidateToJobStatus } from "../../store/jobs/selectors";
import { Candidate, CandidateDetails, Job } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { routeCandidates } from "../../utils/route";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";
import AssignJobModal from "./assign-job-modal";
import Details from "./candidate-details";
import InterviewStage from "./interview-stage";

const PageWrapper = styled(Col)`
    padding-top: 32px;
`;

const AddInterview = styled(PlusCircle)`
    cursor: pointer;
`;

const CandidateProfile = () => {
    const { id } = useParams<Record<string, string>>();
    const history = useHistory();
    const dispatch = useDispatch();

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isAssignJobOpen, setIsAssignJobOpen] = useState(false);

    const getCandidateDetailsStatus = useSelector(selectGetCandidateDetailsStatus, shallowEqual);
    const addCandidateToJobStatus = useSelector(selectAddCandidateToJobStatus, shallowEqual);
    const candidate: CandidateDetails | undefined = useSelector(selectCandidateDetails(id), shallowEqual);

    useEffect(() => {
        dispatch(fetchCandidateDetails(id));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (addCandidateToJobStatus === ApiRequestStatus.Success) {
            dispatch(fetchCandidateDetails(id));
        }
        // eslint-disable-next-line
    }, [addCandidateToJobStatus]);

    const scheduleInterview = () => {
        setIsScheduleOpen(true);
    };

    const archiveCandidateHandler = () => {
        dispatch(archiveCandidate(id));
        history.push(routeCandidates());
    };

    const restoreArchivedCandidateHandler = () => {
        dispatch(restoreArchivedCandidate(id));
    };

    const onAssignToJobClicked = () => setIsAssignJobOpen(true);

    const onAssignJob = (job: Job) => {
        setIsAssignJobOpen(false);
        dispatch(addCandidateToJob(id, job.jobId));
    };

    if (!candidate) {
        return <Spinner />;
    }

    return (
        <LayoutWide>
            <PageWrapper md={{ span: 20, offset: 2 }} xl={{ span: 16, offset: 4 }}>
                <>
                    <Details
                        candidate={candidate as Candidate}
                        onUpdateDetails={updateCandidate}
                        onScheduleInterview={scheduleInterview}
                        onAssignToJobClicked={onAssignToJobClicked}
                        onArchive={archiveCandidateHandler}
                        onRestoreArchive={restoreArchivedCandidateHandler}
                    />
                    {getCandidateDetailsStatus === ApiRequestStatus.InProgress && <Spinner />}

                    {getCandidateDetailsStatus !== ApiRequestStatus.InProgress &&
                        candidate.stages &&
                        candidate.stages.length > 0 && (
                            <>
                                {candidate.stages.map(stage => (
                                    <InterviewStage
                                        key={stage.linkId}
                                        stage={stage.stageName}
                                        interviewDate={stage.interviewStartDate}
                                        interviews={stage.interviews}
                                    />
                                ))}

                                {!candidate.archived ? (
                                    <AddInterview size={32} color='#8C2BE3' onClick={scheduleInterview} />
                                ) : (
                                    <PlusCircle size={32} color='#9CA3AF' />
                                )}
                            </>
                        )}
                </>
            </PageWrapper>

            <ScheduleInterviewModal
                open={isScheduleOpen}
                candidateId={candidate.candidateId}
                onClose={() => setIsScheduleOpen(false)}
            />

            <AssignJobModal
                open={isAssignJobOpen}
                onAssignJob={onAssignJob}
                onClose={() => setIsAssignJobOpen(false)}
            />
        </LayoutWide>
    );
};

export default CandidateProfile;

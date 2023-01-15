import { Col } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import LayoutWide from "../../components/layout-wide/layout-wide";
import Spinner from "../../components/spinner/spinner";
import { PlusCircle } from "lucide-react";
import {
    archiveCandidate,
    fetchCandidateDetails,
    restoreArchivedCandidate,
    updateCandidate,
} from "../../store/candidates/actions";
import { selectCandidateDetails, selectGetCandidateDetailsStatus } from "../../store/candidates/selector";
import { Candidate, CandidateDetails } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import Details from "./candidate-details";
import InterviewStage from "./interview-stage";
import styled from "styled-components";
import { routeCandidates } from "../../utils/route";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";

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

    const getCandidateDetailsStatus = useSelector(selectGetCandidateDetailsStatus, shallowEqual);
    const candidate: CandidateDetails | undefined = useSelector(selectCandidateDetails(id), shallowEqual);

    useEffect(() => {
        dispatch(fetchCandidateDetails(id));
        // eslint-disable-next-line
    }, []);

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
        </LayoutWide>
    );
};

export default CandidateProfile;

import { Col, Modal } from "antd";
import { Dictionary } from "lodash";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import LayoutWide from "../../components/layout-wide/layout-wide";
import Spinner from "../../components/spinner/spinner";
import { PlusCircle } from "lucide-react";
import { ApiRequest, fetchCandidateDetails, updateCandidate } from "../../store/candidates/actions";
import { selectCandidate } from "../../store/candidates/selector";
import { CandidateDetails, Candidate, Interview } from "../../store/models";
import { ApiRequestStatus, IApiResults, RootState } from "../../store/state-models";
import Details from "./candidate-details";
import InterviewStage from "./interview-stage";
import InterviewSchedule from "../interview-schedule/interview-schedule";
import styled from "styled-components";

const PageWrapper = styled(Col)`
    padding-top: 32px;
`;

const AddInterview = styled(PlusCircle)`
    cursor: pointer;
`;

type Props = {
    candidate?: CandidateDetails;
    interviews: Dictionary<Interview[]> | never[];
    fetchCandidateDetails: any;
    updateCandidate: any;
    apiResults: IApiResults;
};

const CandidateProfile = ({ candidate, interviews, fetchCandidateDetails, updateCandidate, apiResults }: Props) => {
    const { id } = useParams<Record<string, string | undefined>>();

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    useEffect(() => {
        fetchCandidateDetails(id);
        // eslint-disable-next-line
    }, []);

    const sheduleInterview = () => {
        setIsScheduleOpen(true);
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
                        onScheduleInterview={sheduleInterview}
                    />
                    {apiResults[ApiRequest.GetCandidateDetails].status === ApiRequestStatus.InProgress && <Spinner />}

                    {apiResults[ApiRequest.GetCandidateDetails].status !== ApiRequestStatus.InProgress &&
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
                                <AddInterview size={32} color='#8C2BE3' onClick={sheduleInterview} />
                            </>
                        )}
                </>
            </PageWrapper>

            {/* @ts-ignore */}
            <Modal
                title='Schedule Interview'
                visible={isScheduleOpen}
                centered={true}
                onCancel={() => setIsScheduleOpen(false)}
                footer={null}
            >
                {/* @ts-ignore */}
                <InterviewSchedule candidateId={candidate.candidateId} onScheduled={() => setIsScheduleOpen(false)} />
            </Modal>
        </LayoutWide>
    );
};

const mapDispatch = {
    fetchCandidateDetails,
    updateCandidate,
};

const mapState = (state: RootState, ownProps: any) => {
    return {
        candidate: selectCandidate(state, ownProps.match.params.id),
        apiResults: state.candidates.apiResults,
    };
};

export default connect(mapState, mapDispatch)(CandidateProfile);

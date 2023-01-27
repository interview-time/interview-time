import { RootState } from "../state-models";
import { Candidate } from "../models";
import { orderBy } from "lodash";

export enum CandidateStatus {
    All = "All",
    Archived = "Archived",
    Current = "Current",
}

export const selectCandidateDetails = (candidateId: string | undefined) => (state: RootState) =>
    state.candidates.candidateDetails.find(candidate => candidate.candidateId === candidateId);

export const selectCandidates = (state: RootState) => {
    return orderBy(state.candidates.candidates, "createdDate", ["desc"]);
};

export const filterCandidates = (candidates: Candidate[], status: CandidateStatus) => {
    let filteredCandidates: Candidate[] = candidates;

    if (status === CandidateStatus.Current) {
        filteredCandidates = candidates.filter(c => !c.archived);
    } else if (status === CandidateStatus.Archived) {
        filteredCandidates = candidates.filter(c => c.archived);
    }

    return filteredCandidates;
};

export const sortCandidatesByCreatedDate = (candidates: Candidate[], ascending: boolean = false) =>
    candidates.sort((a, b) =>
        ascending
            ? new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
            : new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
    );

export const selectGetCandidatesStatus = (state: RootState) => state.candidates.apiResults.GetCandidateList.status;

export const selectGetCandidateDetailsStatus = (state: RootState) => state.candidates.apiResults.GetCandidateDetails.status;

export const selectCreateCandidateStatus = (state: RootState) => state.candidates.apiResults.CreateCandidate.status;

export const selectUpdateCandidateStatus = (state: RootState) => state.candidates.apiResults.UpdateCandidate.status;

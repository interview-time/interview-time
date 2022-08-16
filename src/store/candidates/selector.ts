import { RootState } from "../state-models";
import { Candidate } from "../models";
import { CandidatesFilter } from "../../utils/constants";
import { orderBy } from "lodash";

export const selectCandidate = (state: RootState, candidateId: string) => {
    return state.candidates.candidates.find(c => c.candidateId === candidateId);
};

export const selectCandidates = (state: RootState) => {
    return orderBy(state.candidates.candidates, "createdDate", ["desc"]);
};

export const filterCandidates = (candidates: Candidate[], filter: string | undefined) => {
    let filteredCandidates: Candidate[] = candidates;

    if (filter === CandidatesFilter.Current) {
        filteredCandidates = candidates.filter(c => !c.archived);
    } else if (filter === CandidatesFilter.Archived) {
        filteredCandidates = candidates.filter(c => c.archived);
    }

    return orderBy(filteredCandidates, "createdDate", ["desc"]);
};

export const searchCandidates = (candidates: Candidate[], query: string) => {
    return candidates.filter(
        candidate =>
            candidate.candidateName.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
            (candidate.position && candidate.position.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    );
};

export const Status = {
    NEW: "NEW",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
}

export const InterviewAssessment = {
    YES: 'YES',
    NO: 'NO',
    STRONG_YES: 'STRONG_YES',
    STRONG_NO: 'STRONG_NO',
}

export const GroupAssessment = {
    NO_PROFICIENCY: 'NO_PROFICIENCY',
    LOW_SKILLED: 'LOW_SKILLED',
    SKILLED: 'SKILLED',
    HIGHLY_SKILLED: 'HIGHLY_SKILLED',
}

export const getDecisionText = (decision) => {
    if (decision === InterviewAssessment.YES) {
        return 'YES';
    } else if (decision === InterviewAssessment.STRONG_YES) {
        return 'STRONG YES';
    } else if (decision === InterviewAssessment.NO) {
        return 'NO';
    } else if (decision === InterviewAssessment.STRONG_NO) {
        return 'STRONG NO';
    }

    return ''
}

export const getDecisionColor = (decision) => {
    if (decision === InterviewAssessment.YES || decision === InterviewAssessment.STRONG_YES) {
        return '#73d13d';
    } else if (decision === InterviewAssessment.NO || decision === InterviewAssessment.STRONG_NO) {
        return '#ff4d4f';
    }

    return '#bfbfbf'
}
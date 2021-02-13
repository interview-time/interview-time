export const DATE_FORMAT_DISPLAY = "MMM DD, YYYY hh:mm a"
export const DATE_FORMAT_SERVER = "YYYY-MM-DDTHH:mm:ssZ"

export const Status = {
    NEW: "NEW",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
}

export const Difficulty = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
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
        return '#52c41a';
    } else if (decision === InterviewAssessment.NO || decision === InterviewAssessment.STRONG_NO) {
        return '#ff4d4f';
    }

    return '#bfbfbf'
}

export const getDifficultyColor = (difficulty) => {
    if (difficulty === Difficulty.EASY) {
        return 'green';
    } else if (difficulty === Difficulty.HARD) {
        return 'red';
    }  else if (difficulty === Difficulty.MEDIUM) {
        return 'orange';
    }

    return '#bfbfbf'
}

export const getStatusColor = (status) => {
    if (status === Status.COMPLETED) {
        return "success"
    } else if (status === Status.NEW || status === Status.STARTED) {
        return "processing"
    }
}

export const getStatusText = (status) => {
    if (status === Status.COMPLETED) {
        return "Completed"
    } else if (status === Status.NEW || status === Status.STARTED) {
        return "Scheduled"
    }
}

export const colors = [
    '#2f54eb',
    '#722ed1',
    '#eb2f96',
    '#52c41a',
    '#13c2c2',
    '#1890ff',
    '#faad14',
    '#a0d911',
    '#f5222d',
]

export const getAvatarColor = (text) => {
    let stringIndex = Math.abs(text.charCodeAt(0)).toString();
    let index = parseInt(stringIndex.charAt(0))
    return colors[index]
}

export const getAvatarText = (text) => text.split(' ').slice(0, 3).map(item => item.charAt(0)).join('')
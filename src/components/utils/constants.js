import { CustomerServiceIcon, DesignIcon, DevelopmentIcon, ManagementIcon, OtherIcon } from "./icons";

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

export const TemplateCategories = [
    {
        key: 'DEVELOPMENT',
        title: 'Software Development',
        titleShort: 'DEVELOPMENT',
        color: '#1890FF',
    },
    {
        key: 'MANAGEMENT',
        title: 'Management',
        titleShort: 'MANAGEMENT',
        color: '#722ED1'
    },
    {
        key: 'DESIGN',
        title: 'Design',
        titleShort: 'DESIGN',
        color: '#F5222D'
    },
    {
        key: 'CUSTOMER SERVICE',
        title: 'Customer Service',
        titleShort: 'CUSTOMER SERVICE',
        color: '#13C2C2'
    },
    {
        key: 'OTHER',
        title: 'Other',
        titleShort: 'OTHER',
        color: '#1F1F1F'
    },
]

export const getTemplateCategoryIcon = (key) => {
    if(key === TemplateCategories[0].key) {
        return <DevelopmentIcon style={{ color: TemplateCategories[0].color, fontSize: 18 }} />
    } else if(key === TemplateCategories[1].key) {
        return <ManagementIcon style={{ color: TemplateCategories[1].color, fontSize: 18 }} />
    } else if(key === TemplateCategories[2].key) {
        return <DesignIcon style={{ color: TemplateCategories[2].color, fontSize: 18 }} />
    } else if(key === TemplateCategories[3].key) {
        return <CustomerServiceIcon style={{ color: TemplateCategories[3].color, fontSize: 18 }} />
    } else if(key === TemplateCategories[4].key) {
        return <OtherIcon style={{ color: TemplateCategories[4].color, fontSize: 18 }} />
    }

    return <DevelopmentIcon style={{ color: TemplateCategories[0].color, fontSize: 18 }} />
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

const COLOR_RED_5 = '#ff4d4f';
const COLOR_ORANGE_5 = '#FFA940';
const COLOR_GREEN_6 = '#52c41a';
const COLOR_GREEN_8 = '#389E0D';
const COLOR_NEUTRAL_6 = '#bfbfbf';

export const getDecisionColor = (decision) => {
    if (decision === InterviewAssessment.YES || decision === InterviewAssessment.STRONG_YES) {
        return COLOR_GREEN_6;
    } else if (decision === InterviewAssessment.NO || decision === InterviewAssessment.STRONG_NO) {
        return COLOR_RED_5;
    }

    return COLOR_NEUTRAL_6
}

export const getAssessmentColor = (assessment) => {
    if(assessment === GroupAssessment.HIGHLY_SKILLED) {
        return COLOR_GREEN_8;
    } else if (assessment === GroupAssessment.SKILLED) {
        return COLOR_GREEN_6;
    } else if (assessment === GroupAssessment.LOW_SKILLED) {
        return COLOR_ORANGE_5;
    } else if (assessment === GroupAssessment.NO_PROFICIENCY) {
        return COLOR_RED_5;
    }

    return COLOR_NEUTRAL_6
}

export const getAssessmentText = (assessment) => {
    if(assessment === GroupAssessment.HIGHLY_SKILLED) {
        return "highly skilled";
    } else if (assessment === GroupAssessment.SKILLED) {
        return "skilled";
    } else if (assessment === GroupAssessment.LOW_SKILLED) {
        return "low skills";
    } else if (assessment === GroupAssessment.NO_PROFICIENCY) {
        return "no proficiency";
    }

    return ""
}

export const getOverallPerformanceColor = (groups) => {
    let total = 0;
    groups.forEach(group => {
        total += getAssessmentNumber(group.assessment)
    })

    return Math.round((total / groups.length) * 100)
}

const getAssessmentNumber = (assessment) => {
    if(assessment === GroupAssessment.HIGHLY_SKILLED) {
        return 1.0;
    } else if (assessment === GroupAssessment.SKILLED) {
        return 0.85;
    } else if (assessment === GroupAssessment.LOW_SKILLED) {
        return 0.45;
    } else if (assessment === GroupAssessment.NO_PROFICIENCY) {
        return 0;
    }

    return 0;
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
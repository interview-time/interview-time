import { CustomerServiceIcon, DesignIcon, DevelopmentIcon, ManagementIcon, OtherIcon } from "./icons";

export const DATE_FORMAT_SERVER = "YYYY-MM-DDTHH:mm:ssZ";

export const Roles = {
    HR: "HR",
    HIRING_MANAGER: "HIRING_MANAGER",
    INTERVIEWER: "INTERVIEWER",
    ADMIN: "ADMIN",
};

export const DisplayRoles = {
    HR: "Recruiter",
    HIRING_MANAGER: "Hiring Manager",
    INTERVIEWER: "Interviewer",
    ADMIN: "Admin",
};

export const Status = {
    NEW: "NEW",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
    SUBMITTED: "SUBMITTED",
};

export const CandidateStatus = {
    NEW: "NEW",
    INTERVIEWING: "INTERVIEWING",
    HIRE: "HIRE",
    NO_HIRE: "NO_HIRE",
};

export const Difficulty = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
    DEFAULT: "Medium",
};

export const InterviewAssessment = {
    NONE: 0,
    YES: 1,
    NO: 2,
    STRONG_YES: 3,
    STRONG_NO: 4,
};

export const QuestionAssessment = {
    POOR: 1,
    GOOD: 2,
    EXCELLENT: 3,
};

export const TemplateCategories = [
    {
        key: "DEVELOPMENT",
        title: "Software Development",
        titleShort: "DEVELOPMENT",
        color: "#1890FF",
        backgroundColor: "#BAE7FF",
    },
    {
        key: "MANAGEMENT",
        title: "Management",
        titleShort: "MANAGEMENT",
        color: "#722ED1",
        backgroundColor: "#EFDBFF",
    },
    {
        key: "DESIGN",
        title: "Design",
        titleShort: "DESIGN",
        color: "#F5222D",
        backgroundColor: "#FFCCC7",
    },
    {
        key: "CUSTOMER SERVICE",
        title: "Customer Service",
        titleShort: "CUSTOMER SERVICE",
        color: "#13C2C2",
        backgroundColor: "#B5F5EC",
    },
    {
        key: "OTHER",
        title: "Other",
        titleShort: "OTHER",
        color: "#1F1F1F",
        backgroundColor: "#FAFAFA",
    },
];

export const getTemplateCategoryBackground = key => {
    let category = TemplateCategories.find(category => category.key === key);
    return category ? category.backgroundColor : "#FAFAFA";
};

export const getTemplateCategoryIcon = key => {
    if (key === TemplateCategories[0].key) {
        return <DevelopmentIcon style={{ color: TemplateCategories[0].color, fontSize: 20 }} />;
    } else if (key === TemplateCategories[1].key) {
        return <ManagementIcon style={{ color: TemplateCategories[1].color, fontSize: 20 }} />;
    } else if (key === TemplateCategories[2].key) {
        return <DesignIcon style={{ color: TemplateCategories[2].color, fontSize: 20 }} />;
    } else if (key === TemplateCategories[3].key) {
        return <CustomerServiceIcon style={{ color: TemplateCategories[3].color, fontSize: 20 }} />;
    } else if (key === TemplateCategories[4].key) {
        return <OtherIcon style={{ color: TemplateCategories[4].color, fontSize: 20 }} />;
    }

    return <DevelopmentIcon style={{ color: TemplateCategories[0].color, fontSize: 20 }} />;
};

export const getStatusColor = status => {
    if (status === Status.COMPLETED) {
        return "success";
    } else if (status === Status.NEW || status === Status.STARTED) {
        return "processing";
    }
};

export const getStatusText = status => {
    if (status === Status.COMPLETED) {
        return "Completed";
    } else if (status === Status.NEW || status === Status.STARTED) {
        return "Scheduled";
    }
};

export const colors = [
    "#D8E7E2",
    "#D6E4F7",
    "#FCD6D5",
    "#DFD4F7",
    "#F9EED8",
    "#F5D5E5",
    "#F9E1D4",
    "#E6E6E5",
    "#E6D7D0",
];

export const getAvatarColor = text => {
    let stringIndex = Math.abs(text.charCodeAt(0)).toString();
    let index = parseInt(stringIndex.charAt(0));
    return colors[index];
};

/**
 *
 * @param {string[]} tags
 * @returns {Map<string, string>}
 */
export const createTagColors = tags => {
    let tagColorsMap = new Map();
    let colorIndex = 0;
    tags.forEach(tag => {
        if (!tagColorsMap.has(tag)) {
            tagColorsMap.set(tag, colors[colorIndex]);
            colorIndex++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }
        }
    });
    return tagColorsMap;
};

export const POSITIONS = [
    "Software Engineer",
    "Site Reliability Engineer",
    "Back-End Developer",
    "Front-End Developer",
    "Full-Stack Developer",
    "Android Developer",
    "iOS Developer",
    "QA Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Data Engineer",
    "Data Analyst",
    "Cloud Engineer",
    "Cloud Security Engineer",
    "Product manager",
    "Project manager",
    "Program manager",
    "Portfolio manager",
    "System administrator",
    "UI Designer",
    "UX Designer",
];

export const POSITIONS_OPTIONS = POSITIONS.map(position => ({
    value: position,
    label: position,
}));

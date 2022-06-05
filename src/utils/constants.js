import { CustomerServiceIcon, DesignIcon, DevelopmentIcon, ManagementIcon, OtherIcon } from "./icons";
import { hashCode } from "./string";

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
    /**
     * Candidate wasn't able to answer the question.
     */
    UNANSWERED: -1,
    /**
     * Question wasn't asked.
     */
    NO_ASSESSMENT: 0,
    POOR: 1,
    GOOD: 2,
    EXCELLENT: 3,
};

const TemplateCategoriesIconStyle = { color: "#FFFFFF", fontSize: 32 };

export const TemplateCategories = [
    {
        key: "DEVELOPMENT",
        title: "Engineering",
        color: "#64B5F6",
        icon: <DevelopmentIcon style={TemplateCategoriesIconStyle} />,
    },
    {
        key: "MANAGEMENT",
        title: "Management",
        color: "#9575CD",
        icon: <ManagementIcon style={TemplateCategoriesIconStyle} />,
    },
    {
        key: "DESIGN",
        title: "Design",
        titleShort: "DESIGN",
        color: "#E57373",
        icon: <DesignIcon style={TemplateCategoriesIconStyle} />,
    },
    {
        key: "CUSTOMER SERVICE",
        title: "Customer Service",
        color: "#4DD0E1",
        icon: <CustomerServiceIcon style={TemplateCategoriesIconStyle} />,
    },
    {
        key: "OTHER",
        title: "Other",
        color: "#616161",
        icon: <OtherIcon style={TemplateCategoriesIconStyle} />,
    },
];

export const getTemplateCategoryBackground = key => {
    let category = TemplateCategories.find(category => category.key === key);
    return category ? category.color : "#616161";
};

export const getTemplateCategoryIcon = key => {
    let category = TemplateCategories.find(category => category.key === key);
    return category ? category.icon : <OtherIcon style={TemplateCategoriesIconStyle} />;
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

export const getTagColor = label => {
    const hash = Math.abs(hashCode(label));
    const hashFirstDigit = Number(String(hash).charAt(0));
    return colors[hashFirstDigit];
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

export const SubscriptionPlans = {
    Starter: "STARTER",
    Premium: "PREMIUM",
};

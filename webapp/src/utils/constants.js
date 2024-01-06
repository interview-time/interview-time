import { ReactComponent as TemplateInterviewIcon } from "../assets/icons/template-interview.svg";
import { ReactComponent as TemplateLiveCodingIcon } from "../assets/icons/template-live-coding.svg";
import { ReactComponent as TemplateTakeHomeTaskIcon } from "../assets/icons/template-take-home-task.svg";
import { InterviewType } from "../store/models";
import { interviewTypeToColor } from "./interview";

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

export const getTemplateCategoryIcon = interviewType => {
    switch (interviewType) {
        case InterviewType.INTERVIEW:
            return <TemplateInterviewIcon color={interviewTypeToColor(interviewType)} width={64} height={64} />;
        case InterviewType.LIVE_CODING:
            return <TemplateLiveCodingIcon color={interviewTypeToColor(interviewType)} width={64} height={64} />;
        case InterviewType.TAKE_HOME_TASK:
            return <TemplateTakeHomeTaskIcon color={interviewTypeToColor(interviewType)} width={64} height={64} />;
        default:
            return <TemplateInterviewIcon color={interviewTypeToColor(interviewType)} width={64} height={64} />;
    }
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

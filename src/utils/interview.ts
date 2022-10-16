import { Interview, InterviewType } from "../store/models";

export const INTERVIEW_TAKE_HOME = "Take Home Assignment";
export const INTERVIEW_LIVE_CODING = "Live Coding Challenge";
export const INTERVIEW_QA = "Technical Q/A";

export const INTERVIEW_TAKE_HOME_SHORT = "Take-Home";
export const INTERVIEW_LIVE_CODING_SHORT = "Live-Coding";
export const INTERVIEW_QA_SHORT = "Tech Q/A";

export const NO_DATE_LABEL = "-";

export const interviewWithoutDate = (interview: Interview) => interview.interviewType === InterviewType.TAKE_HOME_TASK;

export const interviewTypeToName = (type: InterviewType): string => {
    switch (type) {
        case InterviewType.INTERVIEW:
            return INTERVIEW_QA;
        case InterviewType.LIVE_CODING:
            return INTERVIEW_LIVE_CODING;
        case InterviewType.TAKE_HOME_TASK:
            return INTERVIEW_TAKE_HOME;
    }
};
export const interviewTypeToNameShort = (type: InterviewType): string => {
    switch (type) {
        case InterviewType.INTERVIEW:
            return INTERVIEW_QA_SHORT;
        case InterviewType.LIVE_CODING:
            return INTERVIEW_LIVE_CODING_SHORT;
        case InterviewType.TAKE_HOME_TASK:
            return INTERVIEW_TAKE_HOME_SHORT;
    }
};
export const interviewTypeToColor = (type: InterviewType): string => {
    switch (type) {
        case InterviewType.INTERVIEW:
            return "#9575CD";
        case InterviewType.LIVE_CODING:
            return "#64B5F6";
        case InterviewType.TAKE_HOME_TASK:
            return "#43B97F";
    }

    return "#9575CD";
};

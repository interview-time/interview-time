import { Interview, InterviewType } from "../store/models";

export const INTERVIEW_TAKE_HOME_TASK= "Take Home Assignment"
export const INTERVIEW_LIVE_CODING = "Live Coding Challenge"
export const INTERVIEW_QA = "Technical Q/A"

export const NO_DATE_LABEL = "-"

export const interviewWithoutDate = (interview: Interview) => interview.interviewType === InterviewType.TAKE_HOME_TASK
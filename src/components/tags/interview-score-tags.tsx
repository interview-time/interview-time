import React from "react";
import { Tag } from "antd";
import { Interview } from "../../store/models";
import { getOverallPerformanceColor, getOverallPerformancePercent } from "../../utils/assessment";
import styled from "styled-components";

const ScoreTag = styled(Tag)`
  && {
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${({ score }: ScoreTagProps) => (score === 0 ? "#6B7280" : "#fff")};
  }
`;

type ScoreTagProps = {
    score: number;
};

type Props = {
    interview: Interview;
};

const InterviewScoreTag = ({ interview }: Props) => (
    <ScoreTag
        score={getOverallPerformancePercent(interview.structure.groups)}
        color={getOverallPerformanceColor(interview.structure.groups)}
    >
        {getOverallPerformancePercent(interview.structure.groups)}
    </ScoreTag>
);

export default InterviewScoreTag;

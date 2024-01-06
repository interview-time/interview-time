import React from "react";
import { Tag } from "antd";
import { getDecisionColor, getDecisionText } from "../../utils/assessment";
import styled from "styled-components";
import { InterviewAssessment } from "../../utils/constants";

const DecisionTag = styled(Tag)`
  && {
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${({ decision }: Props) => (decision === InterviewAssessment.NONE ? "#6B7280" : "#fff")};
  }
`;

type Props = {
    decision: number;
};

const InterviewDecisionTag = ({ decision }: Props) => (
    <div>
        <DecisionTag decision={decision} color={getDecisionColor(decision)}>
            {getDecisionText(decision)}
        </DecisionTag>
    </div>
);

export default InterviewDecisionTag;

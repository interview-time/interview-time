import { filterGroupsWithAssessment } from "../../../utils/filters";
import { Col, Row } from "antd";
import CompetenceAreaChart from "../../charts/competence-area-chart";
import QuestionDifficultyChart from "../../charts/question-difficulty-chart";
import QuestionAnswersChart from "../../charts/question-answers-chart";
import { Interview } from "../../../store/models";
import Card from "../../card/card";

type Props = {
    interview: Readonly<Interview>;
};

const InterviewChartsCard = ({ interview }: Props) => {
    let groups = filterGroupsWithAssessment(interview.structure.groups);

    if (groups.length === 0) {
        return <></>;
    }

    return (
        <Row gutter={24}>
            <Col span={8}>
                <Card withPadding={false}>
                    {/* @ts-ignore */}
                    <CompetenceAreaChart groups={groups} />
                </Card>
            </Col>

            <Col span={8}>
                <Card withPadding={false}>
                    {/* @ts-ignore */}
                    <QuestionDifficultyChart groups={groups} />
                </Card>
            </Col>

            <Col span={8}>
                <Card withPadding={false}>
                    {/* @ts-ignore */}
                    <QuestionAnswersChart groups={groups} />
                </Card>
            </Col>
        </Row>
    );
};

export default InterviewChartsCard;

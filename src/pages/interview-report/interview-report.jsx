import { loadInterviews } from "../../store/interviews/actions";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import styles from "./interviews-report.module.css";
import { Button, Card, Col, Divider, Progress, Row, Space } from "antd";
import React, { useState } from "react";
import Text from "antd/lib/typography/Text";
import { DATE_FORMAT_DISPLAY, InterviewAssessment } from "../../components/utils/constants";
import {
    getGroupAssessmentColor,
    getGroupAssessmentPercent,
    getGroupAssessmentText,
    getOverallPerformanceColor,
    getOverallPerformancePercent,
    getQuestionsWithAssessment,
} from "../../components/utils/assessment";
import { useHistory, useParams } from "react-router-dom";
import { cloneDeep } from "lodash/lang";
import { findInterview } from "../../components/utils/converters";
import moment from "moment";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import { StarEmphasisIcon} from "../../components/utils/icons";
import { routeInterviewScorecard } from "../../components/utils/route";

/**
 *
 * @param {Interview[]} interviews
 * @param loadInterviews
 */
const InterviewReport = ({ interviews, loadInterviews }) => {

    /**
     * @type {Interview}
     */
    const emptyInterview = {
        candidate: '',
        position: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    const [interview, setInterview] = useState(emptyInterview);

    const { id } = useParams();

    const history = useHistory();

    React.useEffect(() => {
        // initial data loading
        if (!interview.interviewId && interviews.length > 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    const onBackClicked = () => {
        history.goBack()
    }

    const onMoreClicked = () => {
        history.push(routeInterviewScorecard(interview.interviewId))
    }

    const initialLoading = () => !interview.interviewId

    const isCandidateQualified = interview.decision === InterviewAssessment.YES
        || interview.decision === InterviewAssessment.STRONG_YES;

    const CompetenceArea = () => <div>
        <Title level={4} style={{ marginBottom: "24px" }}>Competence Areas</Title>
        {interview.structure.groups.map(group =>
            <Row style={{ marginBottom: 24 }} justify="center">
                <Col flex="1" className={styles.divHorizontalCenter}>
                    <span>{group.name}</span>
                </Col>
                <Col flex="1" className={styles.divHorizontalCenter}>
                    <Progress
                        type='line'
                        status="active"
                        strokeLinecap='square'
                        strokeColor='#69C0FF'
                        steps={10}
                        strokeWidth={16}
                        percent={getGroupAssessmentPercent(group)}
                    />
                </Col>
                <Col flex="1" className={styles.divHorizontalCenter}>
                                            <span className={styles.dotSmall}
                                                  style={{ backgroundColor: getGroupAssessmentColor(group) }} />
                    <span>{getGroupAssessmentText(group)}</span>
                </Col>
            </Row>
        )}
    </div>;

    const OverallPerformance = () => <div className={styles.divVerticalCenter}>
        <Progress
            style={{ marginBottom: 16 }}
            type='circle'
            strokeLinecap='square'
            strokeColor={getOverallPerformanceColor(interview.structure.groups)}
            percent={getOverallPerformancePercent(interview.structure.groups)}
        />
        <span>{getQuestionsWithAssessment(interview.structure.groups).length} questions</span>
    </div>;

    const Notes = () => <div>
        <Title level={4} style={{ marginBottom: "24px" }}>Notes</Title>
        <span>{interview.notes && interview.notes.length > 0 ? interview.notes : "There are no notes."}</span>
    </div>;

    const InterviewInformation = () => {
        return <Row style={{ marginTop: "24px", width: '100%' }}>
            <Col flex="140px">
                <Space direction="vertical" size={16}>
                    <Text type="secondary">Candidate Name:</Text>
                    <Text type="secondary">Position:</Text>
                    <Text type="secondary">Interview Date:</Text>
                    <Text type="secondary">Recommendation:</Text>
                </Space>
            </Col>
            <Col flex="1">
                <Space direction="vertical" size={16}>
                    <Text>{interview.candidate}</Text>
                    <Text>{interview.position}</Text>
                    <Text>{moment(interview.interviewDateTime).format(DATE_FORMAT_DISPLAY)}</Text>
                    {isCandidateQualified && <Space>
                        <Text className={styles.assessmentGreen}>qualified for the position</Text>
                        <StarEmphasisIcon className={styles.assessmentIcon} />
                    </Space>}
                    {!isCandidateQualified && <Text className={styles.assessmentRed}>not qualified for the position</Text>}
                </Space>
            </Col>
        </Row>;
    };

    return (
        <Layout>
            <Row className={styles.rootContainer}>

                <Col key={interview.interviewId}
                     xxl={{ span: 14, offset: 5 }}
                     xl={{ span: 18, offset: 3 }}
                     lg={{ span: 24 }}
                     md={{ span: 24 }}
                     sm={{ span: 24 }}
                     xs={{ span: 24 }}
                >

                    <Card loading={initialLoading()} bodyStyle={{ padding: 48 }}>
                        <div className={styles.headerTitleContainer} onClick={onBackClicked}>
                            <ArrowLeftOutlined />{" "}
                            <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                                Candidate Report
                            </Title>
                        </div>

                        <div className={styles.divSpaceBetween}>
                            <InterviewInformation />
                            <OverallPerformance />
                        </div>

                        <Divider style={{ marginTop: 36, marginBottom: 36 }} />
                        <CompetenceArea />
                        <Divider style={{ marginTop: 36, marginBottom: 36 }} />
                        <Notes />

                        <div className={styles.moreContainer}>
                            <Button ghost type="primary" onClick={onMoreClicked}>More details</Button>
                        </div>

                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}

const mapDispatch = { loadInterviews }

const mapState = (state) => {
    const interviewsState = state.interviews || {};
    return {
        interviews: interviewsState.interviews,
    }
}

export default connect(mapState, mapDispatch)(InterviewReport);
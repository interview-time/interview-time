import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, message, Modal, PageHeader, Tag } from 'antd';
import Layout from "../../components/layout/layout";
import styles from "./interview-start.module.css";
import { connect } from "react-redux";
import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import lang from "lodash/lang";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";
import { getDecisionColor, getDecisionText, Status } from "../../components/utils/constants";

const DATA_UPLOAD_INTERVAL = 10000 // 10 sec

const InterviewStart = ({ interviews, loading, loadInterviews, updateInterview, deleteInterview }) => {

    const emptyInterview = {
        id: undefined,
        candidate: '',
        position: '',
        guideId: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    const [interview, setInterview] = useState(emptyInterview);
    const { id } = useParams();
    const history = useHistory();

    React.useEffect(() => {
        if (isStartedStatus()) {
            const id = setInterval(() => {
                // TODO only upload data if it has changed
                updateInterview(interview)
            }, DATA_UPLOAD_INTERVAL);
            return () => clearInterval(id);
        }
        // eslint-disable-next-line
    }, [interview]);

    React.useEffect(() => {
        if (!interview.interviewId) {
            const interview = interviews.find(interview => interview.interviewId === id);
            if (interview) {
                const updatedInterview = lang.cloneDeep(interview);
                if (!updatedInterview.status) {
                    updatedInterview.status = Status.NEW
                }
                setInterview(updatedInterview)
            }
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        if (interviews.length === 0 && !loading) {
            loadInterviews();
        }
    });

    const onStartClicked = () => {
        Modal.confirm({
            title: "When you start the interview you will not be able to edit this interview anymore. Are you sure that you want to start?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                const updatedInterview = { ...interview, status: Status.STARTED }
                updateInterview(updatedInterview)
                setInterview(updatedInterview)
            }
        })
    }

    const onDeleteClicked = () => {
        Modal.confirm({
            title: "Are you sure that you want to delete the interview?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                deleteInterview(interview.interviewId);
                history.push("/interviews");
                message.success(`Interview '${interview.candidate}' removed.`);
            }
        })
    }

    const onCompletedClicked = () => {
        if (!interview.decision) {
            Modal.warn({
                title: "Please select summary 'assessment'.",
            })
        } else {
            Modal.confirm({
                title: "When you complete the interview you will not be able to make changes to this interview anymore. Are you sure that you want to complete the interview?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    const updatedInterview = { ...interview, status: Status.COMPLETED }
                    updateInterview(updatedInterview);
                    history.push("/interviews");
                    message.success(`Interview '${interview.candidate}' marked as completed.`);
                }
            })
        }
    }

    const onBackClicked = () => {
        if (isStartedStatus()) {
            updateInterview(interview)
        }
        history.push("/interviews");
    }

    const isNewStatus = () => interview.status === Status.NEW

    const isStartedStatus = () => interview.status === Status.STARTED

    const isCompletedStatus = () => interview.status === Status.COMPLETED
    return (
        <Layout pageHeader={
            <div className={styles.sticky}>
                <PageHeader
                    className={styles.pageHeader}
                    title={`Interview - ${interview.candidate}`}
                    tags={
                        <>
                            {interview.decision &&
                            <Tag
                                color={getDecisionColor(interview.decision)}>{getDecisionText(interview.decision)}</Tag>}
                        </>
                    }
                    onBack={onBackClicked}
                    extra={[
                        <Button danger onClick={onDeleteClicked}>Delete</Button>,
                        <>{isNewStatus() && <Button type="default">
                            <Link to={`/interviews/details/${id}`}>
                                <span className="nav-text">Edit</span>
                            </Link>
                        </Button>}</>,
                        <>{isNewStatus() && <Button type="primary" onClick={onStartClicked}>Start</Button>}</>,
                        <>{isStartedStatus() &&
                        <Button type="primary" onClick={onCompletedClicked}>Complete</Button>}</>,
                    ]}>
                    {isNewStatus() && <Text>Click on the <Text strong>start</Text> button to initiate the interview
                        which unlocks assessment and notes.</Text>}
                    {isStartedStatus() &&
                    <Text>Click on the <Text strong>complete</Text> button to submit your interview
                        assessment and notes. Your data is saved automatically.</Text>}
                    {isCompletedStatus() && <Text>This interview has been completed.</Text>}
                </PageHeader>
            </div>
        }>
            <InterviewDetailsCard
                paddingTop={106} /* header height */
                interview={interview}
                disabled={isNewStatus() || isCompletedStatus()} />

        </Layout>
    )
}

const mapStateToProps = state => {
    const { interviews, loading } = state.interviews || {};

    return { interviews, loading };
};

export default connect(mapStateToProps, {
    loadInterviews,
    updateInterview,
    deleteInterview
})(InterviewStart);
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Divider, Dropdown, Menu, message, Modal, PageHeader, Space, Tag } from 'antd';
import Layout from "../../components/layout/layout";
import styles from "./interview.module.css";
import { connect} from "react-redux";
import { deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import InterviewDetailsCard from "./interview-details-card";
import { Status } from "../../components/utils/constants";
import { SyncOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash/lang";
import { debounce } from "lodash/function";
import { routeInterviewDetails, routeInterviews } from "../../components/utils/route";
import { findInterview } from "../../components/utils/converters";

const DATA_CHANGE_DEBOUNCE_MAX = 60 * 1000 // 60 sec
const DATA_CHANGE_DEBOUNCE = 30 * 1000 // 30 sec
const KEY_EDIT = 'edit'
const KEY_DELETE = 'delete'

const Interview = ({interviews, interviewsUploading, deleteInterview, loadInterviews, updateInterview}) => {

    const emptyInterview = {
        candidate: '',
        position: '',
        guideId: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    const [interview, setInterview] = useState(emptyInterview);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const { id } = useParams();

    const history = useHistory();

    React.useEffect(() => {
        // initial data loading
        if (!interview.interviewId) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    const isNewStatus = () => interview.status === Status.NEW || interview.status === Status.STARTED

    const isCompletedStatus = () => interview.status === Status.COMPLETED

    const onInterviewChange = () => {
        setUnsavedChanges(true)
        onInterviewChangeDebounce()
    }

    let onInterviewChangeDebounce = debounce(function () {
        updateInterview(interview)
        setUnsavedChanges(false)
    }, DATA_CHANGE_DEBOUNCE, { 'maxWait': DATA_CHANGE_DEBOUNCE_MAX })

    const onDeleteClicked = () => {
        Modal.confirm({
            title: "Are you sure that you want to delete the interview?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                deleteInterview(interview.interviewId);
                history.push(routeInterviews());
                message.success(`Interview '${interview.candidate}' removed.`);
            }
        })
    }

    const onCompletedClicked = () => {
        if (!interview.decision) {
            Modal.warn({
                title: "Please select summary 'decision'.",
            })
        } else {
            Modal.confirm({
                title: "When you complete the interview you will not be able to make changes to this interview anymore. Are you sure that you want to complete the interview?",
                okText: "Yes",
                cancelText: "No",
                onOk() {
                    const updatedInterview = { ...interview, status: Status.COMPLETED }
                    updateInterview(updatedInterview);
                    history.push(routeInterviews());
                    message.success(`Interview '${interview.candidate}' marked as complete.`);
                }
            })
        }
    }

    const onBackClicked = () => {
        history.push(routeInterviews());
    }

    const onSaveClicked = () => {
        updateInterview(interview)
        setUnsavedChanges(false)
        message.success(`Interview '${interview.candidate}' updated.`);
    }

    const onEditClicked = () => {
        history.push(routeInterviewDetails(id))
    }

    const handleMenuClick = (e) => {
        if (e.key === KEY_EDIT) {
            onEditClicked()
        } else if (e.key === KEY_DELETE) {
            onDeleteClicked()
        }
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={KEY_EDIT}>Edit</Menu.Item>
            <Menu.Item key={KEY_DELETE} danger>Delete</Menu.Item>
        </Menu>
    );

    return (
        <Layout pageHeader={
            <div className={styles.sticky}>
                <PageHeader
                    className={styles.pageHeader}
                    title={`Interview • ${interview.candidate}`}
                    tags={
                        <>
                            {interviewsUploading && <Tag
                                icon={<SyncOutlined spin />}
                                color="processing">saving data</Tag>}
                            {unsavedChanges && <Tag color="processing">unsaved changes</Tag>}
                        </>
                    }
                    onBack={onBackClicked}
                    extra={[
                        <>{isNewStatus() && <Space>
                            <Dropdown.Button
                                loading
                                overlay={menu}
                                onClick={onSaveClicked}>
                                Save
                            </Dropdown.Button>
                            <Button type="primary" onClick={onCompletedClicked}>Complete</Button>
                        </Space>}
                            {isCompletedStatus() && <Button danger onClick={onDeleteClicked}>Delete</Button>}
                        </>
                    ]}>
                </PageHeader>
                <Divider style={{ padding: 0, margin: 0 }} />
            </div>
        }>
            <InterviewDetailsCard
                paddingTopContent={72 + 24} /* header height + padding */
                paddingTopAnchor={72 + 24} /* header height + padding */
                interview={interview}
                onInterviewChange={onInterviewChange}
                disabled={isCompletedStatus()} />

        </Layout>
    )
}

const mapDispatch = { deleteInterview, loadInterviews, updateInterview }
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    return {
        interviews: interviewsState.interviews,
        interviewsUploading: interviewsState.uploading
    }
}

export default connect(mapState, mapDispatch)(Interview);
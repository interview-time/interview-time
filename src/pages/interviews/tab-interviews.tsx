import { ConfigProvider, List, Modal } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import EmptyState from "../../components/empty-state/empty-state";
import { Interview } from "../../store/models";
import { routeInterviewScorecard } from "../../utils/route";
import InterviewCard from "./interview-card";

type Props = {
    interviews: Interview[];
    onDeleteInterview: (interviewId: string) => void;
    onEditInterview: (interview: Interview) => void;
};

const TabInterviews = ({ interviews, onDeleteInterview, onEditInterview }: Props) => {
    const history = useHistory();

    const onInterviewClicked = (interview: Interview) => {
        history.push(routeInterviewScorecard(interview.interviewId));
    };

    const showDeleteDialog = (id: string, candidateName?: string) => {
        let message =
            "Are you sure you want to delete interview " + (candidateName ? `with '${candidateName}' ?` : "?");
        Modal.confirm({
            title: "Delete Interview",
            content: message,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                onDeleteInterview(id);
            },
        });
    };

    return (
        <ConfigProvider renderEmpty={() => <EmptyState message='You currently don’t have any interviews.' />}>
            <List
                style={{ marginTop: 24 }}
                grid={{ gutter: 32, column: 1 }}
                split={false}
                dataSource={interviews}
                pagination={{
                    defaultPageSize: 8,
                    hideOnSinglePage: true,
                }}
                renderItem={(interview: Interview) => (
                    <List.Item>
                        <InterviewCard
                            interview={interview}
                            onInterviewClicked={onInterviewClicked}
                            onEditInterviewClicked={onEditInterview}
                            onDeleteInterviewClicked={interview => {
                                showDeleteDialog(interview.interviewId, interview.candidate);
                            }}
                        />
                    </List.Item>
                )}
            />
        </ConfigProvider>
    );
};

export default TabInterviews;

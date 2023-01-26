import { ConfigProvider, List } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import EmptyState from "../../components/empty-state/empty-state";
import { Interview } from "../../store/models";
import { routeInterviewScorecard } from "../../utils/route";
import InterviewCard from "./interview-card";
import DeleteInterviewModal from "../interview-schedule/delete-interview-modal";

type DeleteInterviewModalProps = {
    visible: boolean;
    interviewId?: string;
    candidateName?: string;
};

type Props = {
    interviews: Interview[];
    onEditInterview: (interview: Interview) => void;
};

const TabInterviews = ({ interviews, onEditInterview }: Props) => {
    const history = useHistory();

    const [deleteInterviewModal, setDeleteInterviewModal] = useState<DeleteInterviewModalProps>({
        interviewId: "",
        visible: false,
    });

    const onInterviewClicked = (interview: Interview) => {
        history.push(routeInterviewScorecard(interview.interviewId));
    };

    const showDeleteDialog = (interview: Interview) =>
        setDeleteInterviewModal({
            visible: true,
            interviewId: interview.interviewId,
            candidateName: interview.candidate,
        });

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
                            onDeleteInterviewClicked={interview => showDeleteDialog(interview)}
                        />
                    </List.Item>
                )}
            />
            <DeleteInterviewModal
                open={deleteInterviewModal.visible}
                interviewId={deleteInterviewModal.interviewId}
                candidateName={deleteInterviewModal.candidateName}
                onClose={() =>
                    setDeleteInterviewModal({
                        visible: false,
                        candidateName: undefined,
                        interviewId: undefined,
                    })
                }
            />
        </ConfigProvider>
    );
};

export default TabInterviews;

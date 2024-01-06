import { ConfigProvider, List } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import EmptyState from "../../components/empty-state/empty-state";
import { Interview } from "../../store/models";
import { routeInterviewScorecard } from "../../utils/route";
import InterviewCard from "./interview-card";
import CancelInterviewModal from "../interview-schedule/cancel-interview-modal";

type CancelInterviewModalProps = {
    visible: boolean;
    interviewId?: string;
    candidateName?: string;
};

type Props = {
    interviews: Interview[];
};

const TabInterviews = ({ interviews }: Props) => {
    const history = useHistory();

    const [cancelInterviewModal, setCancelInterviewModal] = useState<CancelInterviewModalProps>({
        interviewId: "",
        visible: false,
    });

    const onInterviewClicked = (interview: Interview) => {
        history.push(routeInterviewScorecard(interview.interviewId));
    };

    const showCancelDialog = (interview: Interview) =>
        setCancelInterviewModal({
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
                            onCancelInterviewClicked={interview => showCancelDialog(interview)}
                        />
                    </List.Item>
                )}
            />
            <CancelInterviewModal
                open={cancelInterviewModal.visible}
                interviewId={cancelInterviewModal.interviewId}
                candidateName={cancelInterviewModal.candidateName}
                onClose={() =>
                    setCancelInterviewModal({
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

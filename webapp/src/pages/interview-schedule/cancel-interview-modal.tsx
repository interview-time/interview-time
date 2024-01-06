import { Modal, Typography } from "antd";
import { cancelInterview } from "../../store/interviews/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { selectCancelInterviewStatus } from "../../store/interviews/selector";
import { useEffect } from "react";

const { Text } = Typography;

type Props = {
    open: boolean;
    interviewId?: string;
    candidateName?: string;
    onClose: (interviewRemoved?: boolean) => void;
};

const CancelInterviewModal = ({ open, interviewId, candidateName, onClose }: Props) => {
    const dispatch = useDispatch();

    const cancelInterviewsStatus: ApiRequestStatus = useSelector(selectCancelInterviewStatus, shallowEqual);
    const isLoading = cancelInterviewsStatus === ApiRequestStatus.InProgress;

    useEffect(() => {
        if (cancelInterviewsStatus === ApiRequestStatus.Success) {
            onClose(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cancelInterviewsStatus]);

    const onCancel = () => {
        if (interviewId) {
            dispatch(cancelInterview(interviewId));
        }
    };

    return (
        <Modal
            open={open}
            title='Cancel Interview'
            okText='Yes'
            onOk={onCancel}
            okButtonProps={{
                loading: isLoading,
                disabled: isLoading,
            }}
            onCancel={() => onClose()}
        >
            <Text>
                {candidateName
                    ? `Are you sure you want to cancel interview with '${candidateName}'?`
                    : `Are you sure you want to cancel the interview?`}
            </Text>
        </Modal>
    );
};

export default CancelInterviewModal;

import { Modal, Typography } from "antd";
import { deleteInterview } from "../../store/interviews/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { selectDeleteInterviewStatus } from "../../store/interviews/selector";
import { useEffect } from "react";

const { Text } = Typography;

type Props = {
    open: boolean;
    interviewId?: string;
    candidateName?: string;
    onClose: (interviewRemoved?: boolean) => void;
};

const DeleteInterviewModal = ({ open, interviewId, candidateName, onClose }: Props) => {
    const dispatch = useDispatch();

    const deleteInterviewsStatus: ApiRequestStatus = useSelector(selectDeleteInterviewStatus, shallowEqual);
    const isLoading = deleteInterviewsStatus === ApiRequestStatus.InProgress;

    useEffect(() => {
        if (deleteInterviewsStatus === ApiRequestStatus.Success) {
            onClose(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteInterviewsStatus]);

    const onDelete = () => {
        if (interviewId) {
            dispatch(deleteInterview(interviewId));
        }
    };

    return (
        <Modal
            open={open}
            title='Delete Interview'
            okText='Yes'
            onOk={onDelete}
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

export default DeleteInterviewModal;

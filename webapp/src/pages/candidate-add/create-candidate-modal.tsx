import CreateCandidateForm from "./create-candidate-form";
import { Modal } from "antd";
import React from "react";
import { Candidate } from "../../store/models";

type Props = {
    open: boolean;
    candidate?: Candidate;
    onSave: (candidateId: string) => void;
    onCancel: () => void;
};

const CreateCandidateModal = ({ open, candidate, onSave, onCancel }: Props) => {
    return (
        <Modal
            title={candidate ? "Edit Candidate" : "New Candidate"}
            open={open}
            centered
            destroyOnClose
            width={600}
            bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
            onCancel={onCancel}
            footer={null}
        >
            <CreateCandidateForm candidate={candidate} onSave={onSave} onCancel={onCancel} />
        </Modal>
    );
};

export default CreateCandidateModal;

import Modal from "antd/lib/modal/Modal";
import styles from "./live-coding-assessment-modal.module.css";
import { AutoComplete, Button, Space } from "antd";
import * as React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

type Props = {
    visible: boolean;
    name: string;
    questionId: string;
    onAdd: (name: string) => void;
    onUpdate: (questionId: string, name: string) => void;
    onCancel: () => void;
    onDelete: (questionId: string) => void;
};

const LiveCodingAssessmentModal = ({ visible, name, questionId, onAdd, onUpdate, onCancel, onDelete }: Props) => {
    const [assessment, setAssessment] = React.useState("");

    const onCancelClicked = () => {
        onCancel();
    };

    const onAddClicked = () => {
        onAdd(assessment);
    };

    const onUpdateClicked = () => {
        onUpdate(questionId, assessment);
    };

    const onDeleteClicked = () => {
        onDelete(questionId);
    };

    const onChange = (value: string) => {
        setAssessment(value);
    };

    const options = [
        {
            value: "Readability (how easy to read)",
        },
        {
            value: "Adaptability (how easy to change)",
        },
        {
            value: "Maintainability (how easy to maintain)",
        },
        {
            value: "Performance (how fast is the code)",
        },
        {
            value: "Accuracy (how accurate is the solution)",
        },
        {
            value: "Security/Privacy (how secure is the solution)",
        },
        {
            value: "Usability (how ease to use)",
        },
    ];

    return (
        /* @ts-ignore */
        <Modal visible={visible} closable={false} destroyOnClose={true} onClose={onCancelClicked} footer={null}>
            <div className={styles.header}>
                <Title level={4}>New Assessment</Title>
                <Text type='secondary'>Enter assessment criteria details.</Text>
            </div>
            <Text strong>Title</Text>
            <AutoComplete
                className={styles.assessmentAutocomplete}
                allowClear
                placeholder='Select or enter your own criteria'
                options={options}
                filterOption={(inputValue, option) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onChange={onChange}
                defaultValue={name}
            />
            <div className={styles.modalFooter}>
                <div className={styles.dangerButtonHolder}>
                    {questionId && (
                        <Button type='ghost' danger onClick={onDeleteClicked}>
                            Delete
                        </Button>
                    )}
                </div>
                <Space>
                    <Button onClick={onCancelClicked}>Cancel</Button>
                    {!questionId && (
                        <Button type='primary' disabled={!assessment || assessment.length === 0} onClick={onAddClicked}>
                            Add
                        </Button>
                    )}
                    {questionId && (
                        <Button
                            type='primary'
                            disabled={!assessment || assessment.length === 0}
                            onClick={onUpdateClicked}
                        >
                            Update
                        </Button>
                    )}
                </Space>
            </div>
        </Modal>
    );
};

export default LiveCodingAssessmentModal;

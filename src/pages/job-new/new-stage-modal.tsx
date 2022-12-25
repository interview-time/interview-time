import { FormLabel } from "../../assets/styles/global-styles";
import { SecondaryText, SecondaryTextSmall } from "./styles";
import { Button, Checkbox, Form, Input, Modal, Select, Space } from "antd";
import { JobStage, JobStageType, Template } from "../../store/models";
import React from "react";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { ColorResult, TwitterPicker } from "react-color";
import { v4 as uuidv4 } from "uuid";
import { filterOptionLabel } from "../../utils/filters";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { log } from "../../utils/log";

const StagesForm = styled(Form)`
    margin-top: 24px;
`;

type StageColorBoxProps = {
    color: string;
};

const StageColorBox = styled.div`
    width: 20px;
    height: 20px;
    background: ${(props: StageColorBoxProps) => props.color};
    border-radius: 6px;
`;

const StageColorSelect = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    border: 1px solid ${Colors.Neutral_200};
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
    padding-left: 12px;
    padding-right: 12px;
    cursor: pointer;

    &:hover {
        border-color: ${Colors.Primary_500};
    }
`;
const FooterContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StageTypeTooltip = styled.div`
    padding-left: 24px;
`;

type Props = {
    stage?: JobStage;
    templates: Template[];
    open: boolean;
    onClose: () => void;
    onSave: (stage: JobStage) => void;
    onRemove: (stage: JobStage) => void;
};

const NewStageModal = ({ stage, templates, open, onClose, onSave, onRemove }: Props) => {
    const getDefaultColor = () => stage?.colour || "#0693E3";
    const getDefaultType = () => stage?.type || JobStageType.Regular;

    const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
    const [color, setColor] = React.useState(getDefaultColor());
    const [type, setType] = React.useState(getDefaultType());

    const [form] = Form.useForm();

    const templatesOptions = templates.map(template => ({
        label: template.title,
        value: template.templateId,
    }));

    React.useEffect(() => {
        if (open) {
            // reset state to initial or prefill from existing stage
            log(stage);
            setColorPickerVisible(false);
            setColor(getDefaultColor());
            setType(getDefaultType());
            form.setFieldsValue({
                title: stage?.title,
                type: stage?.type,
                template: stage?.templateId,
            });
        }
    }, [open, stage]);

    const onFormSubmit = (values: any) => {
        if (stage) {
            onSave({
                ...stage,
                title: values.title,
                templateId: values.template,
                type: type,
                colour: color,
            });
        } else {
            onSave({
                stageId: uuidv4(),
                title: values.title,
                templateId: values.template,
                disabled: false,
                type: type,
                colour: color,
            });
        }
    };

    const onColorSelected = (color: ColorResult) => {
        setColor(color.hex);
        setColorPickerVisible(false);
    };

    const ModalFooter = (
        <FooterContainer>
            <div>
                {stage && stage.stageId && (
                    <Button
                        danger
                        onClick={() => {
                            if (stage) onRemove(stage);
                        }}
                    >
                        Remove
                    </Button>
                )}
            </div>
            <Space size={16}>
                <Button onClick={onClose}>Cancel</Button>
                <Button type='primary' onClick={() => form.submit()}>
                    Save
                </Button>
            </Space>
        </FooterContainer>
    );

    const onInterviewStageMarkerChange = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            setType(JobStageType.Interview);
        } else {
            setType(JobStageType.Regular);
        }
    };

    return (
        <Modal
            title={stage ? "Edit Stage" : "New Stage"}
            open={open}
            onCancel={onClose}
            footer={ModalFooter}
            destroyOnClose
        >
            <SecondaryText>Enter stage details.</SecondaryText>
            <StagesForm name='basic' layout='vertical' form={form} onFinish={onFormSubmit}>
                <Form.Item name='color' label={<FormLabel>Color</FormLabel>}>
                    <StageColorSelect onClick={() => setColorPickerVisible(true)}>
                        <StageColorBox color={color} />
                    </StageColorSelect>
                    {colorPickerVisible && <TwitterPicker onChangeComplete={onColorSelected} />}
                </Form.Item>
                <Form.Item
                    name='title'
                    label={<FormLabel>Title</FormLabel>}
                    rules={[
                        {
                            required: true,
                            message: "Please enter stage title",
                        },
                    ]}
                >
                    <Input placeholder='Screening' />
                </Form.Item>

                <Space direction='vertical' size={4}>
                    <Checkbox defaultChecked={type === JobStageType.Interview} onChange={onInterviewStageMarkerChange}>
                        This is an interview stage.
                    </Checkbox>
                    <StageTypeTooltip>
                        <SecondaryTextSmall>
                            Pipeline stage marked as interview must be linked to an interview template.
                        </SecondaryTextSmall>
                    </StageTypeTooltip>
                </Space>
                {type === JobStageType.Interview && (
                    <>
                        <Form.Item
                            style={{ marginTop: 24, marginBottom: 4 }}
                            name='template'
                            required
                            label={<FormLabel>Interview Template</FormLabel>}
                            rules={[
                                {
                                    required: true,
                                    message: "Please select job stage type",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder='Select template'
                                options={templatesOptions}
                                filterOption={filterOptionLabel}
                            />
                        </Form.Item>
                        <SecondaryTextSmall>
                            Interview stage type must be linked to an interview template
                        </SecondaryTextSmall>
                    </>
                )}
            </StagesForm>
        </Modal>
    );
};

export default NewStageModal;

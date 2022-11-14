import Text from "antd/lib/typography/Text";
import Card from "../../../components/card/card";
import React from "react";
import styles from "./template-checklist-card.module.css";
import Title from "antd/lib/typography/Title";
import { InterviewChecklist } from "../../../store/models";
import { Button, Checkbox, Input } from "antd";
import { Plus, Trash2 } from "lucide-react";

const { TextArea } = Input;

type Props = {
    checklist: InterviewChecklist[];
    onAddChecklist: (checklist: InterviewChecklist) => void;
    onRemoveChecklist: (index: number) => void;
    onUpdateChecklist: (checklist: InterviewChecklist, index: number) => void;
};

const TemplateChecklistCard = ({ checklist, onAddChecklist, onRemoveChecklist, onUpdateChecklist }: Props) => {

    const onAddClicked = () =>
        onAddChecklist({
            item: "",
            checked: false,
        });

    const onRemoveClicked = (index: number) => onRemoveChecklist(index);

    const onTextChange = (checklist: InterviewChecklist, text: string, index: number) =>
        onUpdateChecklist(
            {
                ...checklist,
                item: text,
            },
            index
        );

    return (
        <Card>
            <Title level={4}>Checklist</Title>
            <Text type='secondary'>Quick reminders for you prior to the interview.</Text>
            <div className={styles.checkboxGroup}>
                {checklist.map((item, index) => (
                    <div className={styles.checkboxItem}>
                        <Checkbox defaultChecked={item.checked} style={{ marginLeft: 0, marginRight: 4 }} />
                        <TextArea
                            key={item.item}
                            placeholder='New checklist item'
                            bordered={false}
                            autoSize
                            defaultValue={item.item}
                            onChange={
                                (e: React.ChangeEvent<HTMLTextAreaElement>) => onTextChange(item, e.target.value, index)
                            }
                        />
                        <Trash2
                            size={20}
                            color='red'
                            className={styles.removeIcon}
                            onClick={() => onRemoveClicked(index)}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.addButtonHolder}>
                <Button className={styles.linkIconButton} type='link' onClick={onAddClicked}>
                    <Plus size={20} /> Add item
                </Button>
            </div>
        </Card>
    );
};

export default TemplateChecklistCard;

import styles from "./interview-checklist-card.module.css";
import Text from "antd/lib/typography/Text";
import React from "react";
import { InterviewChecklist } from "../../store/models";
import Title from "antd/lib/typography/Title";
import Card from "../card/card";
import { Checkbox, Divider } from "antd";

type Props = {
    checklist: InterviewChecklist[];
    onChecklistItemClicked: (index: number, checked: boolean) => void;
};

export const InterviewChecklistCard = ({ checklist, onChecklistItemClicked }: Props) => {
    return (
        <Card withPadding={false}>
            <Title level={5} className={styles.title}>
                Checklist
            </Title>
            <Divider />
            <div className={styles.content}>
                <Text type='secondary'>Quick reminders for you prior to the interview.</Text>
                <div className={styles.checkboxGroup}>
                    {checklist.map((item, index) => (
                        <Checkbox
                            defaultChecked={item.checked}
                            style={{ marginLeft: 0, marginRight: 4 }}
                            onChange={e => onChecklistItemClicked(index, e.target.checked)}
                        >
                            {item.item}
                        </Checkbox>
                    ))}
                </div>
            </div>
        </Card>
    );
};

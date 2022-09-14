import Text from "antd/lib/typography/Text";
import Card from "../../../components/card/card";
import React from "react";
import styles from "./template-footer-card.module.css";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";

type Props = {
    footer: string;
    onFooterChanged: (header: string) => void;
};

const TemplateFooterCard = ({ footer, onFooterChanged }: Props) => {
    return (
        <Card className={styles.cardSpace}>
            <Title level={4}>End of interview</Title>
            <Text type='secondary'>
                This section serves as a reminder for what interviewer should do at the end of the interview.
            </Text>
            <TextArea
                style={{ marginTop: 16 }}
                defaultValue={footer}
                onChange={e => onFooterChanged(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Allow 10 minutes at the end for the candidate to ask questions.'
            />
        </Card>
    );
};

export default TemplateFooterCard;

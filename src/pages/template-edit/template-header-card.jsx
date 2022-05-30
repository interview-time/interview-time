import Text from "antd/lib/typography/Text";
import Card from "../../components/card/card";
import React from "react";
import styles from "./template.module.css";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";

/**
 *
 * @param {string} header
 * @param {function} onHeaderChanged
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateHeaderCard = ({ header, onHeaderChanged }) => {
    return (
        <Card className={styles.cardSpace}>
            <Title level={4}>Intro</Title>
            <Text type='secondary'>
                Intro section serves as a reminder for what interviewer should do at the beginning of the interview.
            </Text>
            <TextArea
                style={{ marginTop: 16 }}
                defaultValue={header}
                onChange={onHeaderChanged}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Take 10 minutes to introduce yourself and make the candidate comfortable.'
            />
        </Card>
    );
};

export default TemplateHeaderCard;

import Text from "antd/lib/typography/Text";
import Card from "../../components/card/card";
import React from "react";
import styles from "./template.module.css";
import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import { Button, Divider, Space } from "antd";

/**
 *
 * @param {string} footer
 * @param {function} onFooterChanged
 * @param {function} onPreviewClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateFooterCard = ({ footer, onFooterChanged, onPreviewClicked }) => {
    return (
        <Card className={styles.cardSpace}>
            <Title level={4}>End of interview</Title>
            <Text type='secondary'>
                This section serves as a reminder for what interviewer should do at the end of the interview.
            </Text>
            <TextArea
                style={{ marginTop: 16 }}
                defaultValue={footer}
                onChange={onFooterChanged}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Allow 10 minutes at the end for the candidate to ask questions.'
            />
            <Divider />

            <div className={styles.divSpaceBetween}>
                <Text />
                <Space>
                    <Button onClick={onPreviewClicked}>Preview</Button>
                    <Button type='primary' htmlType='submit'>
                        Save template
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default TemplateFooterCard;

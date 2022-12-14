import Card from "../../../components/card/card";
import React from "react";
import { Typography, Input } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

type Props = {
    header: string | undefined;
    onHeaderChanged: (header: string) => void;
};

const TemplateHeaderCard = ({ header, onHeaderChanged }: Props) => {
    return (
        <Card>
            <Title level={4}>💡 Interview reminders</Title>
            <Text type='secondary'>
                This section serves as a reminder for what interviewer should do at the beginning of the interview.
            </Text>
            <TextArea
                style={{ marginTop: 16 }}
                defaultValue={header}
                onChange={e => onHeaderChanged(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 5 }}
                placeholder='Take 10 minutes to introduce yourself and make the candidate comfortable.'
            />
        </Card>
    );
};

export default TemplateHeaderCard;

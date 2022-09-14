import { Col, Form, Input, Row } from "antd";
import Text from "antd/lib/typography/Text";
import TemplateImage from "../../../components/template-card/template-image";
import Card from "../../../components/card/card";
import React from "react";
import Title from "antd/lib/typography/Title";
import { InterviewType } from "../../../store/models";

type Props = {
    interviewType: InterviewType;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
};

const TemplateMetaCard = ({ interviewType, onTitleChange, onDescriptionChange }: Props) => {
    return (
        <Card style={{ paddingBottom: 0 }}>
            <Row gutter={[24, 24]} wrap={false}>
                <Col flex='auto'>
                    <div style={{ marginBottom: 12 }}>
                        <Title level={4}>Details</Title>
                    </div>
                    <Text type='secondary'>
                        Enter template detail information so you can easily discover it among other templates.
                    </Text>
                </Col>
                <Col>
                    {/* @ts-ignore */}
                    <TemplateImage interviewType={interviewType} />
                </Col>
            </Row>
            <Row gutter={[32, 32]} style={{ marginTop: 36 }}>
                <Col span={12}>
                    <Form.Item
                        name='title'
                        label={<Text strong>Title</Text>}
                        rules={[
                            {
                                required: true,
                                message: "Please enter template title",
                            },
                        ]}
                    >
                        <Input placeholder='e.g. Android' onChange={e => onTitleChange(e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name='description' label={<Text strong>Description</Text>}>
                        <Input
                            placeholder='e.g. Entry-level software engineer'
                            onChange={e => onDescriptionChange(e.target.value)}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export default TemplateMetaCard;

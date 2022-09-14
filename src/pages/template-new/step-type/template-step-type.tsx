import styles from "./template-step-type.module.css";
import { Col, List, Row } from "antd";
import Card from "../../../components/card/card";
import Title from "antd/lib/typography/Title";
import React from "react";
import Text from "antd/lib/typography/Text";
import TemplateImageTechnicalQA from "../../../assets/template-technical-qa.png";
import TemplateImageLiveCoding from "../../../assets/template-live-coding.png";
import TemplateImage from "../../../components/template-card/template-image";
import { InterviewType } from "../../../store/models";

type Props = {
    interviewType?: InterviewType;
    onInterviewTypeChange: any;
};

const TemplateStepType = ({ onInterviewTypeChange, interviewType }: Props) => {
    const data = [
        {
            title: "Live Coding",
            description: "Evaluate candidates' code across several criteria.",
            image: TemplateImageLiveCoding,
            interviewType: InterviewType.LIVE_CODING,
        },
        {
            title: "Question/Answer",
            description: "Ask questions from different competence areas.",
            image: TemplateImageTechnicalQA,
            interviewType: InterviewType.INTERVIEW,
        },
    ];

    return (
        <Row justify='center'>
            <Col span={20} xl={{ span: 16 }} className={styles.rootCol}>
                <Title level={5}>Choose interview type</Title>
                <Text type='secondary'>Select interview type to reveal specifically designed template details.</Text>
                <List
                    className={styles.list}
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                className={item.interviewType === interviewType ? styles.cardSelected : styles.card}
                                onClick={() => onInterviewTypeChange(item.interviewType)}
                            >
                                <div>
                                    <TemplateImage interviewType={item.interviewType} />
                                    <Title level={5} className={styles.cardTitle}>
                                        {item.title}
                                    </Title>
                                    <Text type='secondary'>{item.description}</Text>
                                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    );
};

export default TemplateStepType;

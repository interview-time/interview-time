import React from "react";
import { Button, Card } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import {
    IntroSection,
    TemplateGroupsSection,
    SummarySection,
} from "../../pages/interview-scorecard/interview-sections";
import defaultIcon from "../../assets/layout.png";
import styles from "./library-preview.module.css";

const LibraryPreview = ({ template, onUseTemplate }) => {
    return (
        <div>
            <Card className={styles.row}>
                <div className={styles.row}>
                    <img
                        alt={template.title}
                        src={template.image ? template.image : defaultIcon}
                        height={50}
                    />
                </div>

                <Title level={4}>{template.title}</Title>

                <div className={styles.description}>
                    <Text>{template.description}</Text>
                </div>

                <Button type="primary" onClick={onUseTemplate}>
                    Use template
                </Button>
            </Card>
            <Card className={styles.row}>
                <IntroSection interview={template} />
            </Card>
            <div className={styles.row}>
                <TemplateGroupsSection template={template} />
            </div>
            <Card>
                <SummarySection interview={template} />
            </Card>
        </div>
    );
};

export default LibraryPreview;

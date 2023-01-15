import { Typography } from "antd";
import { defaultTo, sumBy } from "lodash";
import pluralize from "pluralize";
import React from "react";
import { useHistory } from "react-router-dom";
import { Template } from "../../store/models";
import { interviewTypeToName } from "../../utils/interview";
import { routeTemplatePreview } from "../../utils/route";
import Card from "../card/card";
import DemoTag from "../demo/demo-tag";
import styles from "./template-card.module.css";
import TemplateImage from "./template-image";

const { Title } = Typography;

type Props = {
    template: Template;
};

const TemplateCard = ({ template }: Props) => {
    const history = useHistory();

    const onPreviewClicked = () => history.push(routeTemplatePreview(template.templateId));

    const getTotalQuestions = () =>
        sumBy(template.structure.groups, group => (group.questions ? group.questions.length : 0));

    const getQuestionsLabel = () => pluralize("QUESTION", getTotalQuestions(), true);

    const getCategoriesLabel = () => pluralize("CATEGORY", defaultTo(template.structure.groups?.length, 0), true);

    const getDescriptionLabel = () =>
        template.description && template.description.length > 0
            ? template.description
            : interviewTypeToName(template.interviewType);

    return (
        <Card className={styles.card} onClick={onPreviewClicked}>
            <TemplateImage interviewType={template.interviewType} />
            <div className={styles.tagHolder}>
                <DemoTag isDemo={template.isDemo || false} />
            </div>
            <Title level={5} style={{ marginBottom: 0 }} className={styles.cardTitle}>
                {template.title}
            </Title>
            <div className={styles.cardDescription}>{getDescriptionLabel()}</div>
            <div className={styles.cardLabel}>
                {getQuestionsLabel()} • {getCategoriesLabel()}
            </div>
        </Card>
    );
};

export default TemplateCard;

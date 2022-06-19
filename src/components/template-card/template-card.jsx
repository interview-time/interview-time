import React from "react";
import { useHistory } from "react-router-dom";
import { sumBy } from "lodash/math";
import { routeInterviewAddFromTemplate, routeTemplatePreview } from "../../utils/route";
import { TemplateCategories } from "../../utils/constants";
import styles from "./template-card.module.css";
import Card from "../card/card";
import { defaultTo } from "lodash/util";
import pluralize from "pluralize";
import { Button } from "antd";
import DemoTag from "../demo/demo-tag";
import Title from "antd/lib/typography/Title";
import TemplateImage from "./template-image";

/**
 *
 * @param {Template} template
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateCard = ({ template }) => {
    const history = useHistory();

    const onScheduleInterviewClicked = () => history.push(routeInterviewAddFromTemplate(template.templateId));

    const onPreviewClicked = () => history.push(routeTemplatePreview(template.templateId));

    const getTotalQuestions = () =>
        sumBy(template.structure.groups, group => (group.questions ? group.questions.length : 0));

    const getQuestionsLabel = () => pluralize("QUESTION", getTotalQuestions(), true);

    const getCategoriesLabel = () => pluralize("CATEGORY", defaultTo(template.structure.groups?.length, 0), true);

    const getDescriptionLabel = () =>
        defaultTo(template.description, TemplateCategories.find(category => category.key === template.type)?.title);
    return (
        <>
            <Card className={styles.card}>
                <TemplateImage templateType={template.type} />
                <div className={styles.tagHolder}>
                    <DemoTag isDemo={template.isDemo} />
                </div>
                <Title level={5} style={{ marginBottom: 0 }} className={styles.cardTitle}>
                    {template.title}
                </Title>
                <div className={styles.cardDescription}>{getDescriptionLabel()}</div>
                <div className={styles.cardLabel}>
                    {getQuestionsLabel()} • {getCategoriesLabel()}
                </div>
            </Card>
            <Card withPadding={false} className={styles.cardActions} style={{backgroundColor: '#ff000000'}}>
                <div className={styles.cardButtons}>
                    <Button className={styles.cardButtonSecondary} onClick={onPreviewClicked}>
                        Preview
                    </Button>
                    <Button className={styles.cardButton} type='primary' onClick={onScheduleInterviewClicked}>
                        Schedule Interview
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default TemplateCard;

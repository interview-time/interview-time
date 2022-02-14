import React from "react";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { sumBy } from "lodash/math";

import { routeInterviewAddFromTemplate, routeTemplatePreview } from "../utils/route";
import { getTemplateCategoryBackground, getTemplateCategoryIcon } from "../utils/constants";
import styles from "./template-card.module.css";
import DemoTag from "../demo/demo-tag";
import Card from "../card/card";

const TemplateCard = ({ template }) => {
    const history = useHistory();

    const getTotalQuestions = groups => sumBy(groups, group => (group.questions ? group.questions.length : 0));

    const onScheduleInterviewClicked = () => history.push(routeInterviewAddFromTemplate(template.templateId));

    const onPreviewClicked = () => history.push(routeTemplatePreview(template.templateId));

    return (
        <>
            <Card className={styles.card}>
                <div className={styles.iconContainer}>
                    <div
                        className={styles.iconBackground}
                        style={{ backgroundColor: getTemplateCategoryBackground(template.type) }}
                    />
                    <div className={styles.icon}>{getTemplateCategoryIcon(template.type)}</div>
                </div>
                <div className={styles.tagHolder}>
                    <DemoTag isDemo={template.isDemo} />
                </div>
                <div className={styles.cardTitleText}>{template.title}</div>
                <div className={styles.cardQuestions}>{getTotalQuestions(template.structure.groups)} questions</div>
            </Card>
            <Card withPadding={false} className={styles.cardActions}>
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

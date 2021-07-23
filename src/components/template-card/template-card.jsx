import React from "react";
import { Button, Card, message, Modal } from "antd";
import { useHistory } from "react-router-dom";
import { sumBy } from "lodash/math";
import { cloneDeep } from "lodash/lang";

import { routeInterviewAddFromLibrary, routeInterviewAddFromTemplate, routeTemplateDetails, } from "../utils/route";
import { getTemplateCategoryBackground, getTemplateCategoryIcon } from "../utils/constants";
import { TemplatePreviewCard } from "../../pages/interview-scorecard/interview-sections";
import styles from "./template-card.module.css";
import DemoTag from "../demo/demo-tag";

const TemplateCard = ({ template, onDeleteTemplate, onCloneTemplate }) => {
    const history = useHistory();
    const [previewModalVisible, setPreviewModalVisible] = React.useState(false);

    const getTotalQuestions = (groups) =>
        sumBy(groups, (group) => (group.questions ? group.questions.length : 0));

    const onPreviewClosed = () => {
        setPreviewModalVisible(false);
    };

    const onEditClicked = (template) => {
        setPreviewModalVisible(false);
        history.push(routeTemplateDetails(template.templateId));
    };

    const onCopyClicked = (template) => {
        setPreviewModalVisible(false);
        if (onCloneTemplate != null) {
            const copy = cloneDeep(template);
            copy.templateId = null;
            copy.title = `Copy of ${template.title}`;
            onCloneTemplate(copy);
            message.success(`Template '${copy.title}' created.`);
        }
    };

    const onDeleteClicked = (template) => {
        setPreviewModalVisible(false);
        if (onDeleteTemplate != null) {
            onDeleteTemplate(template.templateId);
            message.success(`Template '${template.title}' removed.`);
        }
    };

    const onCreateInterviewClicked = (template) => {
        setPreviewModalVisible(false);
        if (template.templateId) {
            history.push(routeInterviewAddFromTemplate(template.templateId));
        } else if (template.libraryId) {
            history.push(routeInterviewAddFromLibrary(template.libraryId));
        }
    };

    return (
        <>
            <Card hoverable bodyStyle={{ padding: 0 }}>
                <div className={styles.card}>
                    <div className={styles.cardHeaderContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.iconBackground}
                                 style={{ backgroundColor: getTemplateCategoryBackground(template.type) }} />
                            <div className={styles.icon}>{getTemplateCategoryIcon(template.type)}</div>
                        </div>
                        <DemoTag isDemo={template.isDemo} />
                    </div>

                    <div className={styles.cardTitleText}>{template.title}</div>
                    <div className={styles.cardQuestions}>{getTotalQuestions(template.structure.groups)} QUESTIONS</div>
                </div>
                <div className={styles.cardActions}>
                    <div className={styles.cardButtons}>
                        <Button
                            className={styles.cardButtonSecondary}
                            onClick={() => setPreviewModalVisible(true)}
                        >
                            Preview
                        </Button>
                        <Button
                            className={styles.cardButton}
                            type="primary"
                            onClick={() => history.push(routeInterviewAddFromTemplate(template.templateId))}
                        >
                            Schedule Interview
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal
                title={null}
                footer={null}
                closable={false}
                destroyOnClose={true}
                width={1000}
                style={{ top: "5%" }}
                bodyStyle={{ backgroundColor: "#EEF0F2F5" }}
                onCancel={onPreviewClosed}
                visible={previewModalVisible}
            >
                <TemplatePreviewCard
                    template={template}
                    onCloseClicked={onPreviewClosed}
                    onEditClicked={() => onEditClicked(template)}
                    onCopyClicked={() => onCopyClicked(template)}
                    onDeleteClicked={() => onDeleteClicked(template)}
                    onCreateInterviewClicked={() => onCreateInterviewClicked(template)}
                />
            </Modal>
        </>
    );
};

export default TemplateCard;

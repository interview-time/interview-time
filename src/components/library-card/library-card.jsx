import React, { useState } from "react";
import { Card, Modal } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { routeTemplateBlankFromLibrary } from "../utils/route";
import LibraryPreview from "../library-preview/library-preview";
import defaultIcon from "../../assets/layout.png";
import styles from "./library-card.module.css";

const LibraryCard = ({ template }) => {
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const history = useHistory();

    var totalQuestions = 0;

    template.structure?.groups?.forEach((group) => (totalQuestions += group.questions.length));

    return (
        <>
            <Card
                hoverable
                bodyStyle={{ padding: 0 }}
                onClick={() => setPreviewModalVisible(true)}
                key={template.id}
            >
                <div className={styles.card}>
                    <div>
                        <img
                            alt={template.title}
                            src={template.image ? template.image : defaultIcon}
                            width={50}
                        />
                    </div>
                    <div className={styles.cardTitle}>{template.title}</div>
                    <div className={styles.cardMetaTitle}>{totalQuestions} QUESTIONS</div>
                </div>
            </Card>

            <Modal
                title={null}
                footer={null}
                destroyOnClose={true}
                width={1000}
                style={{ top: "5%" }}
                bodyStyle={{ backgroundColor: "#EEF0F2F5" }}
                onCancel={() => setPreviewModalVisible(false)}
                closeIcon={<CloseCircleOutlined style={{ fontSize: "26px" }} />}
                visible={previewModalVisible}
            >
                <LibraryPreview
                    template={template}
                    onUseTemplate={() => history.push(routeTemplateBlankFromLibrary(template.libraryId))}
                />
            </Modal>
        </>
    );
};

export default LibraryCard;

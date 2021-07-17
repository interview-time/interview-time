import React from "react";
import { Card} from "antd";
import { useHistory } from "react-router-dom";
import { routeTemplatePreview } from "../utils/route";
import defaultIcon from "../../assets/layout.png";
import styles from "./library-card.module.css";

const LibraryCard = ({ template }) => {
    const history = useHistory();

    var totalQuestions = 0;

    template.structure?.groups?.forEach((group) => (totalQuestions += group.questions.length));

    const onCardClicked = () => {
        history.push(routeTemplatePreview(template.libraryId))
    }

    return (
        <Card
            hoverable
            bodyStyle={{ padding: 0 }}
            onClick={onCardClicked}
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
    );
};

export default LibraryCard;

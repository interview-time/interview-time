import React from "react";
import { useHistory } from "react-router-dom";
import { routeLibraryTemplatePreview } from "../../utils/route";
import defaultIcon from "../../assets/layout.png";
import styles from "./library-card.module.css";
import Card from "../card/card";

const LibraryCard = ({ template }) => {
    const history = useHistory();

    var totalQuestions = 0;

    template.structure?.groups?.forEach(group => (totalQuestions += group.questions.length));

    const onCardClicked = () => {
        history.push(routeLibraryTemplatePreview(template.libraryId));
    };

    return (
        <Card className={styles.card} onClick={onCardClicked} key={template.id}>
            <div>
                <div>
                    <img alt={template.title} src={template.image ? template.image : defaultIcon} width={72} />
                </div>
                <div className={styles.cardTitle}>{template.title}</div>
                <div className={styles.cardMetaTitle}>{totalQuestions} QUESTIONS</div>
            </div>
        </Card>
    );
};

export default LibraryCard;

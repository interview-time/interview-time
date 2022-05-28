import styles from "./template-card.module.css";
import { getTemplateCategoryBackground, getTemplateCategoryIcon } from "../utils/constants";
import { TemplateIcon } from "../utils/icons";

/**
 *
 * @param {String} templateType
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateImage = ({ templateType }) => {
    return (
        <div className={styles.iconContainer}>
            <TemplateIcon
                className={styles.iconBackground}
                style={{ color: getTemplateCategoryBackground(templateType) }}
            />
            <div className={styles.icon}>{getTemplateCategoryIcon(templateType)}</div>
        </div>
    );
};

export default TemplateImage;

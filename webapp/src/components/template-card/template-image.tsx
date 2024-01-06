import styles from "./template-card.module.css";
import { getTemplateCategoryIcon } from "../../utils/constants";
import { InterviewType } from "../../store/models";

type Props = {
    interviewType: InterviewType;
};
const TemplateImage = ({ interviewType }: Props) => (
    <div className={styles.icon}>{getTemplateCategoryIcon(interviewType)}</div>
);

export default TemplateImage;

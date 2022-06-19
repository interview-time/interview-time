import styles from "./illustration-section.module.css";
import Text from "antd/lib/typography/Text";
import { Button } from "antd";
import React from "react";

/**
 *
 * @param {string|JSX.Element} title
 * @param {string|JSX.Element} description
 * @param {string|JSX.Element} buttonText
 * @param {string} buttonType
 * @param {function} onButtonClicked
 * @param {JSX.Element} illustration
 * @param style
 * @returns {JSX.Element}
 * @constructor
 */
const IllustrationSection = ({
    title,
    description,
    buttonText,
    buttonType = "primary",
    onButtonClicked,
    illustration,
    style,
}) => {
    return (
        <div className={styles.moreSeatsRoot}>
            <div className={styles.moreSeatsIllustrationDiv} style={style}>
                {illustration}
                <div className={styles.moreSeatsDiv}>
                    <Text className={styles.moreSeatsTitle}>{title}</Text>
                    <Text className={styles.moreSeatsDescription}>{description}</Text>
                    <div className={styles.moreSeatsButtonDiv}>
                        <Button type={buttonType} onClick={onButtonClicked}>
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IllustrationSection;

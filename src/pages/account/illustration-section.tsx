import styles from "./illustration-section.module.css";
import Text from "antd/lib/typography/Text";
import { Button } from "antd";
import React, { CSSProperties } from "react";
import { ButtonType } from "antd/lib/button";

type Props = {
    title: string;
    description: string | JSX.Element;
    buttonText: string;
    buttonType: ButtonType;
    onButtonClicked: React.MouseEventHandler;
    illustration: JSX.Element;
    style?: CSSProperties;
};

const IllustrationSection = ({
    title,
    description,
    buttonText,
    buttonType,
    onButtonClicked,
    illustration,
    style,
}: Props) => {
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

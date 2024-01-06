import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import styles from "./back-button.module.css";
import { Button } from "antd";
import { BackIcon } from "../../utils/icons";

type Props = {
    title: string;
    onClick: any;
};

const BackButton = ({ title, onClick }: Props) => {
    const history = useHistory();

    const onBackClicked = () => {
        if (onClick) {
            onClick();
        } else {
            history.goBack();
        }
    };

    return (
        <div className={styles.component}>
            <Button icon={<BackIcon />} size='large' onClick={onBackClicked} className={styles.button} />
            <span className={styles.title} onClick={onBackClicked}>
                {title}
            </span>
        </div>
    );
};

export default BackButton;

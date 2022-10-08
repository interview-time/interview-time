import { Button } from "antd";
import React from "react";
import styles from "./empty-state.module.css";

type Props = {
    message: string;
    secondMessage?: string;
    buttonText?: string;
    buttonLoading?: boolean;
    onButtonClicked?: React.MouseEventHandler;
    illustration: JSX.Element;
};

const EmptyState = ({ message, secondMessage, buttonText, buttonLoading, onButtonClicked, illustration }: Props) => {
    return (
        <div className={styles.wrapper}>
            {illustration}
            <p className={styles.message}>
                {message}
                {secondMessage && (
                    <>
                        <br />
                        {secondMessage}
                    </>
                )}
            </p>
            {onButtonClicked && (
                <Button loading={buttonLoading} type='primary' onClick={onButtonClicked}>
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;

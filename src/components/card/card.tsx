import styles from "./card.module.css";
import { CSSProperties, MouseEventHandler } from "react";
import { Typography } from "antd";

const { Title } = Typography;

type Props = {
    withPadding?: boolean;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
    className?: string;
    title?: string;
    children?: JSX.Element[] | JSX.Element;
};

const Card = ({ withPadding = true, onClick, style, className, title, children }: Props) => {
    const paddingStyle = () => (withPadding ? styles.padding : styles.noPadding);

    const clickStyle = () => {
        if (onClick) {
            return styles.clickable;
        }

        return null;
    };

    return (
        <div
            className={`${styles.card} ${paddingStyle()} ${clickStyle()} ${className}`}
            style={style}
            onClick={onClick}
        >
            {title && (
                <Title level={4} className={!withPadding ? styles.title : children ? "" : styles.titleOnly}>
                    {title}
                </Title>
            )}

            {children}
        </div>
    );
};

export default Card;

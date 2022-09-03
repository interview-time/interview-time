import styles from "./card.module.css";
import { CSSProperties, MouseEventHandler } from "react";
import { Typography } from "antd";
import classNames from "classnames";

const { Title } = Typography;

type Props = {
    withPadding?: boolean;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
    className?: string;
    title?: string;
    subtitle?: string;
    children?: JSX.Element[] | JSX.Element;
    featured?: boolean;
};

const Card = ({ withPadding = true, onClick, style, className, title, subtitle, children, featured }: Props) => {
    return (
        <div
            className={classNames({
                [styles.card]: true,
                [styles.padding]: withPadding,
                [styles.noPadding]: !withPadding,
                [styles.clickable]: onClick,
                [styles.featured]: featured,
                className,
            })}
            style={style}
            onClick={onClick}
        >
            {title && (
                <>
                    <Title level={4} className={!withPadding ? styles.title : children ? "" : styles.titleOnly}>
                        {title}
                    </Title>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </>
            )}

            {children}
        </div>
    );
};

export default Card;

import React from "react";
import { GithubFilled } from "@ant-design/icons";
import styles from "./github-link.module.css";
import { Button } from "antd";
import classNames from "classnames";

type Props = {
    url: string;
    primary?: boolean;
    className?: string;
};

const GitHubLink = ({ url, primary, className }: Props) => (
    <Button
        className={classNames({
            [styles.button]: true,
            [styles.buttonSecondary]: !primary,
            [className ?? ""]: className,
        })}
        type={primary ? "primary" : "default"}
        href={url}
        target='blank'
        rel='noreferrer'
    >
        <GithubFilled className={styles.icon} />
        GitHub Repo
    </Button>
);

export default GitHubLink;

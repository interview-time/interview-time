import React from "react";
import styles from "./file.module.css";
import { ReactComponent as DownloadIcon } from "../../assets/download.svg";

type Props = {
    filename: string;
    url: string
};

const File = ({ filename, url}: Props) => {
    return (
        <div className={styles.file}>
            <a className={styles.downloadLink} href={url}>{filename}</a>
            <DownloadIcon />
        </div>
    );
};

export default File;

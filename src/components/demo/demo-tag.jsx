import { Tag } from "antd";
import styles from "./demo-tag.module.css";

/**
 *
 * @param {boolean} isDemo
 * @constructor
 */
const DemoTag = ({ isDemo }) => (
    <>
        {isDemo && (
            <Tag className={styles.demoTag} color='purple'>
                Demo
            </Tag>
        )}
    </>
);

export default DemoTag;

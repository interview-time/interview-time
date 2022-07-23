import { Tag } from "antd";
import styles from "./demo-tag.module.css";

type Props = {
    isDemo: boolean;
};
const DemoTag = ({ isDemo }: Props) => (
    <>
        {isDemo && (
            <Tag className={styles.demoTag} color='purple'>
                Demo
            </Tag>
        )}
    </>
);

export default DemoTag;

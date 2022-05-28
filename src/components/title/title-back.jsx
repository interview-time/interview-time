import { ArrowLeftOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";

/**
 *
 * @param {string} title
 * @param onBackClicked
 * @returns {JSX.Element}
 * @constructor
 */
const TitleBack = ({ title, onBackClicked }) => {
    return (
        <Title level={4} onClick={onBackClicked} style={{ marginBottom: 0, display: "inline", cursor: "pointer" }}>
            <ArrowLeftOutlined style={{ fontSize: 16 }} /> {title}
        </Title>
    );
};

export default TitleBack;

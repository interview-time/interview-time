import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Title } = Typography;

type Props = {
    title: string;
    onBackClicked: any;
};

const TitleBack = ({ title, onBackClicked }: Props) => {
    return (
        <Title level={4} onClick={onBackClicked} style={{ marginBottom: 0, display: "inline", cursor: "pointer" }}>
            <ArrowLeftOutlined style={{ fontSize: 16 }} /> {title}
        </Title>
    );
};

export default TitleBack;

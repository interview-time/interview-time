import React from "react";
import { connect } from "react-redux";
import { Col, Row, Skeleton, Typography } from "antd";
import Layout from "../../components/layout/layout";
import LibraryCard from "../../components/library-card/library-card";
import { loadLibrary } from "../../store/templates/actions";
import styles from "./template-library.module.css";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const TemplateLibrary = ({ loadLibrary, library, loading }) => {
    const history = useHistory();

    React.useEffect(() => {
        loadLibrary();
        // eslint-disable-next-line
    }, []);

    const onBackClicked = () => {
        history.goBack();
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <div className={styles.header} onClick={onBackClicked}>
                    <ArrowLeftOutlined style={{ marginRight: 12 }} />
                    <Title level={4} style={{ marginBottom: 0 }}>
                        Public templates library
                    </Title>
                </div>

                {loading && (
                    <Row gutter={[32, 32]}>
                        <Col span={24} lg={{ span: 8 }}>
                            <Skeleton active />
                        </Col>
                        <Col span={24} lg={{ span: 8 }}>
                            <Skeleton active />
                        </Col>
                        <Col span={24} lg={{ span: 8 }}>
                            <Skeleton active />
                        </Col>
                    </Row>
                )}

                {!loading && (
                    <Row gutter={[32, 32]}>
                        {library.map(template => (
                            <Col span={24} lg={{ span: 8 }}>
                                <LibraryCard template={template} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Layout>
    );
};

const mapDispatch = { loadLibrary };
const mapState = state => {
    const templatesState = state.templates || {};

    return {
        library: templatesState.library,
        loading: templatesState.loadingLibrary,
    };
};

export default connect(mapState, mapDispatch)(TemplateLibrary);

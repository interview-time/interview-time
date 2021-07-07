import React from "react";
import { connect } from "react-redux";
import { Row, Col, Skeleton, Typography } from "antd";
import Layout from "../../components/layout/layout";
import LibraryCard from "../../components/library-card/library-card";
import { loadLibrary } from "../../store/templates/actions";
import styles from "./library.module.css";

const { Title } = Typography;

const Library = ({ loadLibrary, library, loading }) => {
    React.useEffect(() => {
        loadLibrary();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2}>Template Library</Title>
                    <span className={styles.subTitle}>Explore interview templates</span>
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
                        {library.map((template) => (
                            <Col span={24} lg={{ span: 8 }}>
                                <LibraryCard template={template} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Col>
        </Layout>
    );
};

const mapDispatch = { loadLibrary };
const mapState = (state) => {
    const templatesState = state.templates || {};

    return {
        library: templatesState.library,
        loading: templatesState.loadingLibrary,
    };
};

export default connect(mapState, mapDispatch)(Library);

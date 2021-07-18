import React from "react";
import { connect } from "react-redux";
import { Card, Col, Modal, Row, Skeleton, Typography } from "antd";
import Layout from "../../components/layout/layout";
import LibraryCard from "../../components/library-card/library-card";
import { loadLibrary } from "../../store/templates/actions";
import styles from "./template-new.module.css";
import { ReactComponent as CsvIcon } from "../../assets/csv.svg";
import { createEvent } from "../../analytics";
import Text from "antd/lib/typography/Text";
import { routeTemplateBlank } from "../../components/utils/route";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const TempalteNew = ({ loadLibrary, library, loading }) => {

    const history = useHistory();

    React.useEffect(() => {
        loadLibrary();
        // eslint-disable-next-line
    }, []);

    const onBlankTemplateClicked = () => history.push(routeTemplateBlank());

    const onFromCSVClicked = () => {
        createEvent("Import from CSV", "Clicked");
        Modal.info({
            title: "Import from CSV",
            content: (
                <div>
                    <p>Coming soon...</p>
                </div>
            ),
            onOk() {
            },
        });
    };

    const onBackClicked = () => {
        history.goBack();
    }

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.headerTitleContainer}>
                    <div className={styles.header} onClick={onBackClicked}>
                        <ArrowLeftOutlined style={{ fontSize: 24, marginRight: 12 }} />
                        <Title level={2} style={{ marginBottom: 0 }}>New Interview Template</Title>
                    </div>
                </div>

                <Row span={24} gutter={[32, 32]}>
                    <Col span={24} lg={{ span: 8, offset: 4 }}>
                        <Card
                            hoverable
                            bodyStyle={{ padding: 0 }}
                            onClick={onBlankTemplateClicked}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <PlusIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>Blank template</Title>
                                    <Text type="secondary">Start from scratch</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={24} lg={{ span: 8 }}>
                        <Card hoverable bodyStyle={{ padding: 0 }} onClick={onFromCSVClicked}>
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <CsvIcon width={50} height={50} />
                                </div>
                                <div className={styles.cardTitle}>
                                    <Title level={5}>From CSV file</Title>
                                    <Text type="secondary">Import your existing questions</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div className={styles.headerTitleContainer}>
                    <Title level={4}>Find & customize a template from the public library</Title>
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

export default connect(mapState, mapDispatch)(TempalteNew);

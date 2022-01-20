import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadTemplates } from "../../store/templates/actions";
import { Col, Row, Skeleton } from "antd";
import { sortBy } from "lodash/collection";
import TemplateCard from "../../components/template-card/template-card";
import Title from "antd/lib/typography/Title";
import { routeTemplateNew } from "../../components/utils/route";
import plusIcon from "../../assets/blank.png";
import styles from "./templates.module.css";
import Card from "../../components/card/card";

/**
 *
 * @param {Template[]} templates
 * @param {boolean} loadingTemplates
 * @param loadTemplates
 * @param loadLibrary
 * @returns {JSX.Element}
 * @constructor
 */
const Templates = ({
    templates,
    loadingTemplates,
    loadTemplates,
}) => {
    const history = useHistory();

    React.useEffect(() => {
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const initialTemplatesLoading = () => templates.length === 0 && loadingTemplates

    const onAddTemplateClicked = () => {
        history.push(routeTemplateNew())
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>Interview Templates</Title>
                {initialTemplatesLoading() && (
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
                        <Col span={24} lg={{ span: 8 }}>
                            <Skeleton active />
                        </Col>
                    </Row>
                )}

                {!initialTemplatesLoading() && (
                    <Row gutter={[32, 32]}>
                        {templates.map((template) => (
                            <Col span={24}
                                 xl={{ span: 8 }}
                                 md={{ span: 12 }}
                            >
                                <TemplateCard
                                    key={template.templateId}
                                    template={template}
                                />
                            </Col>
                        ))}
                        <Col span={24}
                             xl={{ span: 8 }}
                             md={{ span: 12 }}
                        >
                            <Card className={styles.addTemplateCard} onClick={() => onAddTemplateClicked()}>
                                <img alt="Add Template" src={plusIcon} width={50} />
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </Layout>
    );
};
const mapDispatch = { loadTemplates };
const mapState = (state) => {
    const templateState = state.templates || {};
    const templates = sortBy(templateState.templates, ["title"]);

    return {
        templates: templates,
        loadingTemplates: templateState.loading,
    };
};

export default connect(mapState, mapDispatch)(Templates);

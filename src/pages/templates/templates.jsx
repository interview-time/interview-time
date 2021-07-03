import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { addTemplate, deleteTemplate, loadLibrary, loadTemplates } from "../../store/templates/actions";
import { Skeleton, Col, Row, Card } from "antd";
import { sortBy } from "lodash/collection";
import PreviewCard from "../../components/preview-card/preview-card";
import TemplateCard from "../../components/template-card/template-card";
import Title from "antd/lib/typography/Title";
import { routeTemplateAdd } from "../../components/utils/route";
import plusIcon from "../../assets/blank.png";
import styles from "./templates.module.css";

/**
 *
 * @param {Template[]} templates
 * @param {Template[]} library
 * @param {boolean} loadingTemplates
 * @param {boolean} loadingLibrary
 * @param loadTemplates
 * @param loadLibrary
 * @param deleteTemplate
 * @param addTemplate
 * @returns {JSX.Element}
 * @constructor
 */
const Templates = ({
    templates,
    library,
    loadingTemplates,
    loadingLibrary,
    loadTemplates,
    loadLibrary,
    deleteTemplate,
    addTemplate,
}) => {
    const history = useHistory();

    React.useEffect(() => {
        loadTemplates();
        loadLibrary();
        // eslint-disable-next-line
    }, []);

    const initialTemplatesLoading = () => templates.length === 0 && loadingTemplates

    const initialLibraryLoading = () => library.length === 0 && loadingLibrary

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <div className={styles.header}>
                    <Title level={2}>Interview Templates</Title>
                    <span className={styles.subTitle}>
                        Schedule interview based on your personal templates or choose from our library
                    </span>
                </div>

                <Title level={5}>My Templates</Title>
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
                    </Row>
                )}

                {!initialTemplatesLoading() && (
                    <Row gutter={[32, 32]}>
                        {templates.map((template) => (
                            <Col span={24} lg={{ span: 8 }}>
                                <TemplateCard
                                    key={template.templateId}
                                    template={template}
                                    onDeleteTemplate={deleteTemplate}
                                    onCloneTemplate={addTemplate}
                                />
                            </Col>
                        ))}
                        <Col span={24} lg={{ span: 8 }}>
                            <Card
                                hoverable
                                bodyStyle={{ padding: 0 }}
                                className={styles.addTemplateCard}
                                onClick={() => history.push(routeTemplateAdd())}
                            >
                                <img alt="Add Template" src={plusIcon} width={50} />
                            </Card>
                        </Col>
                    </Row>
                )}

                <Title level={5}>Library Templates</Title>
                {initialLibraryLoading() && (
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

                {!initialLibraryLoading() && (
                    <Row gutter={[32, 32]}>
                        {library.map((template) => (
                            <Col span={24} lg={{ span: 8 }}>
                                <PreviewCard key={template.libraryId} template={template} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Col>
        </Layout>
    );
};
const mapDispatch = { loadTemplates, loadLibrary, deleteTemplate, addTemplate };
const mapState = (state) => {
    const templateState = state.templates || {};
    const templates = sortBy(templateState.templates, ["title"]);

    return {
        templates: templates,
        library: templateState.library,
        loadingTemplates: templateState.loading,
        loadingLibrary: templateState.loadingLibrary,
    };
};

export default connect(mapState, mapDispatch)(Templates);

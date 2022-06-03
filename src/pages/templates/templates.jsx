import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadTemplates } from "../../store/templates/actions";
import { Col, Modal, Row, Skeleton } from "antd";
import { sortBy } from "lodash/collection";
import TemplateCard from "../../components/template-card/template-card";
import Title from "antd/lib/typography/Title";
import { routeTemplateBlank, routeTemplateLibrary } from "../../components/utils/route";
import styles from "./templates.module.css";
import CardHero from "../../components/card/card-hero";
import { DuplicateIcon, NewFileIcon, UploadIcon } from "../../components/utils/icons";
import { createEvent } from "../../analytics";

const iconStyle = { fontSize: 24, color: "#8C2BE3" };

/**
 *
 * @param {Template[]} templates
 * @param {boolean} loadingTemplates
 * @param loadTemplates
 * @param loadLibrary
 * @returns {JSX.Element}
 * @constructor
 */
const Templates = ({ templates, loadingTemplates, loadTemplates }) => {
    const history = useHistory();

    React.useEffect(() => {
        loadTemplates();
        // eslint-disable-next-line
    }, []);

    const initialTemplatesLoading = () => templates.length === 0 && loadingTemplates;

    const onAddTemplateClicked = () => {
        history.push(routeTemplateBlank());
    };

    const onFromLibraryClicked = () => {
        history.push(routeTemplateLibrary());
    };

    const onImportClicked = () => {
        createEvent("Import from CSV", "Clicked");
        Modal.info({
            title: "Import from CSV",
            content: (
                <div>
                    <p>Coming soon...</p>
                </div>
            ),
            onOk() {},
        });
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Templates
                </Title>

                <Row gutter={[32, 32]}>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onAddTemplateClicked}
                            icon={<NewFileIcon style={iconStyle} />}
                            title='Blank'
                            text='Start from scratch'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onFromLibraryClicked}
                            icon={<DuplicateIcon style={iconStyle} />}
                            title='From public library '
                            text='Find & customize a template'
                        />
                    </Col>
                    <Col span={24} xl={{ span: 8 }} md={{ span: 12 }}>
                        <CardHero
                            onClick={onImportClicked}
                            icon={<UploadIcon style={iconStyle} />}
                            title='Import questions'
                            text='From a CSV'
                        />
                    </Col>
                </Row>

                <Title level={5} style={{ marginBottom: 12, marginTop: 32 }}>
                    Your templates
                </Title>

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
                        {templates.map(template => (
                            <Col span={24} xl={{ span: 8 }} md={{ span: 12 }} key={template.templateId}>
                                <TemplateCard key={template.templateId} template={template} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Layout>
    );
};
const mapDispatch = { loadTemplates };
const mapState = state => {
    const templateState = state.templates || {};
    const templates = sortBy(templateState.templates, ["title"]);

    return {
        templates: templates,
        loadingTemplates: templateState.loading,
    };
};

export default connect(mapState, mapDispatch)(Templates);

import { Button, Divider, Space } from "antd";
import styles from "./library-template-preview.module.css";
import defaultIcon from "../../assets/layout.png";
import { Typography } from "antd";
import { IntroSection, TemplateGroupsSection } from "../interview-scorecard/step-assessment/type-interview/interview-sections";
import { loadLibrary } from "../../store/templates/actions";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { findLibraryTemplate } from "../../utils/converters";
import Layout from "../../components/layout/layout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { routeTemplateBlankFromLibrary } from "../../utils/route";
import Card from "../../components/card/card";

const { Title, Text } = Typography;

/**
 *
 * @param {Template[]} library
 * @param loadLibrary
 * @returns {JSX.Element}
 * @constructor
 */
const LibraryTemplatePreview = ({ library, loadLibrary }) => {
    /**
     *
     * @type {Template}
     */
    const emptyTemplate = {
        libraryId: undefined,
        title: "",
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [],
        },
    };

    const history = useHistory();

    const { id } = useParams();

    const [template, setTemplate] = useState(emptyTemplate);

    useEffect(() => {
        if (!template.libraryId && library.length !== 0) {
            setTemplate(findLibraryTemplate(id, library));
        }
        // eslint-disable-next-line
    }, [library, id]);

    useEffect(() => {
        loadLibrary();
        // eslint-disable-next-line
    }, []);

    const onBackClicked = () => {
        history.goBack();
    };

    const onUseTemplateClicked = () => {
        history.push(routeTemplateBlankFromLibrary(template.libraryId));
    };

    const isInitialLoading = () => !template.libraryId;

    return (
        <Layout >
            <div>
                <Card loading={isInitialLoading()}>
                    <div className={styles.headerContainer}>
                        <Space size={16} direction='vertical' className={styles.headerDescriptionContainer}>
                            <div className={styles.headerTextContainer} onClick={onBackClicked}>
                                <ArrowLeftOutlined />
                                <Title level={4} style={{ marginBottom: 0, marginLeft: 8 }}>
                                    {template.title}
                                </Title>
                            </div>
                            <Text>{template.description}</Text>
                        </Space>

                        <img
                            className={styles.headerImage}
                            alt={template.title}
                            src={template.image ? template.image : defaultIcon}
                            height={72}
                        />
                    </div>
                    <Divider />
                    <div className={styles.buttonContainer}>
                        <Button type='primary' onClick={onUseTemplateClicked}>
                            Use template
                        </Button>
                    </div>
                </Card>
                <Card className={styles.cardSpace} loading={isInitialLoading()}>
                    <IntroSection interview={template} />
                </Card>
                <div className={styles.cardSpace}>
                    <TemplateGroupsSection template={template} />
                </div>
            </div>
        </Layout>
    );
};

const mapDispatch = { loadLibrary };
const mapState = state => {
    const templateState = state.templates || {};

    return {
        library: templateState.library,
    };
};

export default connect(mapState, mapDispatch)(LibraryTemplatePreview);

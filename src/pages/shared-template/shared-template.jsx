import { Button, Card, Col, Divider, Dropdown, Row } from "antd";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import {
    IntroSection,
    SummarySection,
    TemplateGroupsSection,
} from "../interview-scorecard/interview-sections";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { routeTemplateBlankFromSharedTemplate } from "../../components/utils/route";
import Spinner from "../../components/spinner/spinner";
import { loadSharedTemplate } from "../../store/templates/actions";
import styles from "./shared-template.module.css";

const SharedTemplate = ({ template, loading, loadSharedTemplate }) => {
    const history = useHistory();
    const { token } = useParams();

    useEffect(() => {
        loadSharedTemplate(token);
    }, [token]);

    return !loading && template ? (
        <Row className={styles.rootContainer}>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <Card className={styles.row}>
                    <img
                        alt="Interviewer"
                        src={process.env.PUBLIC_URL + "/logo+text.png"}
                        className={styles.logo}
                    />
                    <div className={styles.header}>{template.title}</div>
                    <Text type="secondary">INTERVIEW TEMPLATE</Text>

                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Text type="secondary">Created by {template.owner}</Text>
                        <Button
                            type="primary"
                            onClick={() => {
                                let newPath = routeTemplateBlankFromSharedTemplate(token);
                                sessionStorage.setItem("forwardUrl", newPath);
                                history.push(newPath);
                            }}
                        >
                            Use Template
                        </Button>
                    </div>
                </Card>
                <Card className={styles.row}>
                    <IntroSection interview={template} />
                </Card>
                <div className={styles.row}>
                    <TemplateGroupsSection template={template} disabled={true} />
                </div>
                <Card className={styles.rowEnd}>
                    <SummarySection interview={template} />
                </Card>
            </Col>
        </Row>
    ) : (
        <Spinner />
    );
};

const mapDispatch = { loadSharedTemplate };
const mapState = (state) => {
    const templateState = state.templates || {};

    return {
        template: templateState.sharedTemplate,
        loading: templateState.loading,
    };
};

export default connect(mapState, mapDispatch)(SharedTemplate);

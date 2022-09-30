import { Button, Card, Col, Divider, Result, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { IntroSection, TemplateGroupsSection } from "../interview-scorecard/step-assessment/type-interview/interview-sections";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { routeTemplateBlankFromSharedTemplate } from "../../utils/route";
import Spinner from "../../components/spinner/spinner";
import { loadSharedTemplate } from "../../store/templates/actions";
import styles from "./shared-template.module.css";
import { Logo } from "../../components/logo/logo";

const SharedTemplate = ({ template, loading, loadSharedTemplate }) => {
    const history = useHistory();
    const { token } = useParams();

    useEffect(() => {
        loadSharedTemplate(token);
    }, [token, loadSharedTemplate]);

    if (loading) {
        return <Spinner />;
    }

    if (!loading && !template) {
        return (
            <div className={styles.emptyState}>
                <Logo />
                <Result
                    className={styles.notFound}
                    status='404'
                    title='Looks like this interview template is no longer available'
                    subTitle='Author might have stopped sharing the template'
                    extra={
                        <Button
                            onClick={() => {
                                history.push("/");
                            }}
                            type='primary'
                        >
                            Goto App
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <Row className={styles.rootContainer}>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>
                <Card className={styles.row}>
                    <Logo />
                    <div className={styles.header}>{template.title}</div>
                    <Text type='secondary'>INTERVIEW TEMPLATE</Text>

                    <Divider />

                    <div className={styles.divSpaceBetween}>
                        <Text type='secondary'>Created by {template.owner}</Text>
                        <Button
                            type='primary'
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
            </Col>
        </Row>
    );
};

const mapDispatch = { loadSharedTemplate };
const mapState = state => {
    const templateState = state.templates || {};

    return {
        template: templateState.sharedTemplate,
        loading: templateState.loading,
    };
};

export default connect(mapState, mapDispatch)(SharedTemplate);

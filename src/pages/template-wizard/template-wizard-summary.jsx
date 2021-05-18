import styles from "./template-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row } from "antd";
import { FileDoneOutlined} from "@ant-design/icons";
import { isEmpty } from "../../components/utils/utils";

const { TextArea } = Input;

const IMAGE_URL = process.env.PUBLIC_URL + '/template-wizard/summary.png'

/**
 *
 * Works with `template` or `interview`.
 */
const TemplateWizardSummary = ({guide, interview, onSave, onBack, onPreview}) => {

    const noError = {
        status: null,
        help: null,
    }

    const [footerError, setFooterError] = useState(noError);

    const onFooterChanged = e => {
        setFooter(e.target.value)
        setFooterError(noError)
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(getFooter())) {
            valid = false;
            setFooterError({
                status: 'error',
                help: "This field is required",
            })
        }

        return valid
    }

    const onSaveClicked = () => {
        if (isDataValid()) {
            onSave()
        }
    }

    const getDataId = () => guide ? guide.guideId : interview.interviewId;

    const getFooter = () => guide ? guide.structure.footer : interview.structure.footer;

    const setFooter = (footer) => {
        if (guide) {
            guide.structure.footer = footer;
        } else if (interview) {
            interview.structure.footer = footer;
        }
    }

    return <Row key={getDataId()} align="middle" wrap={false} className={styles.row}>
        <Col
            xxl={{ span: 12, offset: 0 }}
            xl={{ span: 14, offset: 0 }}
            lg={{ span: 16, offset: 4 }}
            md={{ span: 16, offset: 4 }}
            sm={{ span: 16, offset: 4 }}
            xs={{ span: 16, offset: 4 }}
        >
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="The summary section serves as a reminder for what interviewer must do at the end of the interview. It also contains fields to take notes and make a final assessment."
                    type="info"
                    showIcon
                    banner
                />
                <Card className={styles.card}>
                    <Form layout="vertical">
                        <Form.Item label="Summary"
                                   required
                                   validateStatus={footerError.status}
                                   help={footerError.help}>
                            <TextArea
                                defaultValue={getFooter()}
                                onChange={onFooterChanged}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                        </Form.Item>
                        <Form.Item style={{marginBottom: 0}}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onBack}>Back</Button>
                                <Button className={styles.button} type="primary" onClick={onSaveClicked}>Save</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Col>
        <Col
            xxl={{ span: 12}}
            xl={{ span: 10 }}
            lg={{ span: 0 }}
            md={{ span: 0 }}
            sm={{ span: 0 }}
            xs={{ span: 0 }}
        >
            <div className={styles.container}>
                <img alt="Intro" src={IMAGE_URL} className={styles.image} />
                <Button
                    className={styles.button}
                    size="large"
                    shape="round"
                    type="primary"
                    onClick={onPreview}
                    icon={<FileDoneOutlined />}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default TemplateWizardSummary
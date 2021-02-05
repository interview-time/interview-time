import styles from "./guide-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row } from "antd";
import { FileDoneOutlined} from "@ant-design/icons";
import { isEmpty } from "../../components/utils/utils";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 18 }
};

const IMAGE_URL = process.env.PUBLIC_URL + '/guide-wizard/guide-wizard-summary.png'

const GuideWizardSummary = ({guide, onSave, onBack}) => {

    const noError = {
        status: null,
        help: null,
    }

    const [footerError, setFooterError] = useState(noError);

    const onFooterChanged = e => {
        guide.structure.footer = e.target.value;
        setFooterError(noError)
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(guide.structure.footer)) {
            valid = false;
            setFooterError({
                status: 'error',
                help: "Please provide 'Summary'.",
            })
        }

        return valid
    }

    const onSaveClicked = () => {
        if (isDataValid()) {
            onSave()
        }
    }

    return <Row key={guide.guideId} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="The summary section serves as a reminder for what interviewer must do at the end of the interview. It also contains fields to take notes and make a final assessment."
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Summary" {...layout}>
                            <TextArea
                                defaultValue={guide.structure.footer}
                                validateStatus={footerError.status}
                                help={footerError.help}
                                onChange={onFooterChanged}
                                autoSize
                                placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                        </Form.Item>
                        <Form.Item {...tailLayout} style={{marginBottom: 0}}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onBack}>Back</Button>
                                <Button className={styles.button} type="primary" onClick={onSaveClicked}>Save</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Col>
        <Col span={12}>
            <div className={styles.container}>
                <img alt="Intro" src={IMAGE_URL} className={styles.image} />
                <Button
                    className={styles.button}
                    size="large"
                    shape="round"
                    type="primary"
                    icon={<FileDoneOutlined />}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default GuideWizardSummary
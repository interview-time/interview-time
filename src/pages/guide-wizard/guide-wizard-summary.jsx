import styles from "./guide-wizard.module.css";
import React from "react";
import { Alert, Button, Card, Col, Form, Input, Row } from "antd";
import { FileDoneOutlined} from "@ant-design/icons";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 18 }
};

const IMAGE_URL = process.env.PUBLIC_URL + '/guide-wizard/guide-wizard-intro.png'

const GuideWizardSummary = ({onSave, onBack}) => {

    return <Row align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Summary section serve as a reminder for what interviewer must do at the end of the interview. It also contains fields to take notes and make final assessment."
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Summary" {...layout}>
                            <TextArea
                                // className={styles.input}
                                // defaultValue={structure.header}
                                // onChange={onHeaderChanged}
                                autoSize
                                placeholder="Allow 10 minutes at the end for the candidate to ask questions." />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onBack}>Back</Button>
                                <Button className={styles.button} type="primary" onClick={onSave}>Save</Button>
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
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

const IMAGE_URL = process.env.PUBLIC_URL + '/guide-wizard/guide-wizard-intro.png'

const GuideWizardIntro = ({guide, onNext, onBack}) => {

    const noError = {
        status: null,
        help: null,
    }

    const [headerError, setHeaderError] = useState(noError);

    const onHeaderChanged = e => {
        guide.structure.header = e.target.value;
        setHeaderError(noError)
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(guide.structure.header)) {
            valid = false;
            setHeaderError({
                status: 'error',
                help: "Please provide 'Intro'.",
            })
        }

        return valid
    }

    const onNextClicked = () => {
        if (isDataValid()) {
            onNext()
        }
    }

    return <Row key={guide.guideId} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Intro section serves as a reminder for what interviewer must do at the beginning of the interview."
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Intro" {...layout}>
                            <TextArea
                                defaultValue={guide.structure.header}
                                validateStatus={headerError.status}
                                help={headerError.help}
                                onChange={onHeaderChanged}
                                autoSize
                                placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
                        </Form.Item>
                        <Form.Item {...tailLayout} style={{marginBottom: 0}}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onBack}>Back</Button>
                                <Button className={styles.button} type="primary" onClick={onNextClicked}>Next</Button>
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

export default GuideWizardIntro
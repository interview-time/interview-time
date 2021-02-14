import styles from "./template-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { isEmpty } from "../../components/utils/utils";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 4, span: 18 }
};

const IMAGE_URL = process.env.PUBLIC_URL + '/intro.png'

/**
 *
 * Works with `template` or `interview`.
 */
const TemplateWizardIntro = ({ guide, interview, onNext, onBack, onPreview }) => {

    const noError = {
        status: null,
        help: null,
    }

    const [headerError, setHeaderError] = useState(noError);

    const onHeaderChanged = e => {
        setHeader(e.target.value)
        setHeaderError(noError)
    }

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(getHeader())) {
            valid = false;
            setHeaderError({
                status: 'error',
                help: "This field is required",
            })
        }

        return valid
    }

    const onNextClicked = () => {
        if (isDataValid()) {
            onNext()
        }
    }

    const getDataId = () => guide ? guide.guideId : interview.interviewId;

    const getHeader = () => guide ? guide.structure.header : interview.structure.header;

    const setHeader = (header) => {
        if (guide) {
            guide.structure.header = header;
        } else if (interview) {
            interview.structure.header = header;
        }
    }

    return <Row key={getDataId()} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Intro section serves as a reminder for what interviewer must do at the beginning of the interview."
                    type="info"
                    showIcon
                    banner
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Intro" {...layout}
                                   validateStatus={headerError.status}
                                   help={headerError.help}>
                            <TextArea
                                defaultValue={getHeader()}
                                onChange={onHeaderChanged}
                                autoSize
                                placeholder="Take 10 minutes to introduce yourself and make the candidate comfortable." />
                        </Form.Item>
                        <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
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
                    onClick={onPreview}
                    icon={<FileDoneOutlined />}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default TemplateWizardIntro
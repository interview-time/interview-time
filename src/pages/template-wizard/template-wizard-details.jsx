import styles from "./template-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Select } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { isEmpty } from "../../components/utils/utils";
import { TemplateCategories } from "../../components/utils/constants";

const { TextArea } = Input;

const categories = TemplateCategories.map(category => ({
    value: category.key,
    label: category.title,
}))

const IMAGE_URL = process.env.PUBLIC_URL + '/template-wizard/details.png'

const TemplateWizardDetails = ({ guide, onNext, onDiscard, onPreview }) => {

    const noError = {
        status: null,
        help: null,
    }

    const [titleError, setTitleError] = useState(noError);

    const [categoryError, setCategoryError] = useState(noError);

    const onTitleChange = e => {
        guide.title = e.target.value;
        setTitleError(noError)
    }

    const onCategoryChange = value => {
        guide.type = value;
        setCategoryError(noError)
    }

    const onDescriptionChange = e => guide.description = e.target.value

    const isDataValid = () => {
        let valid = true;
        if (isEmpty(guide.title)) {
            valid = false;
            setTitleError({
                status: 'error',
                help: "This field is required",
            })
        }

        if (isEmpty(guide.type)) {
            valid = false;
            setCategoryError({
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

    return <Row key={guide.guideId} align="middle" wrap={false} className={styles.row}>
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
                    message="Enter template detail information so you can easily discover it among other templates."
                    type="info"
                    showIcon
                    banner
                />
                <Card className={styles.card}>
                    <Form layout="vertical">
                        <Form.Item label="Title"
                                   required
                                   validateStatus={titleError.status}
                                   help={titleError.help}>
                            <Input
                                placeholder="Software Developer"
                                onChange={onTitleChange}
                                defaultValue={guide.title}
                            />
                        </Form.Item>
                        <Form.Item label="Category"
                                   required
                                   validateStatus={categoryError.status}
                                   help={categoryError.help}>
                            <Select
                                placeholder="Select category"
                                defaultValue={guide.type}
                                onSelect={onCategoryChange}
                                options={categories}
                                showSearch
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <TextArea
                                placeholder="Template description"
                                defaultValue={guide.description}
                                onChange={onDescriptionChange}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onDiscard}>Discard</Button>
                                <Button className={styles.button} type="primary" onClick={onNextClicked}>Next</Button>
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
                    icon={<FileDoneOutlined />}
                    onClick={onPreview}>Interview Preview</Button>
            </div>
        </Col>
    </Row>
}

export default TemplateWizardDetails
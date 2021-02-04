import styles from "./guide-wizard.module.css";
import React, { useState } from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Select } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 16 }
};

const categories = [
    { value: 'Behavioral' },
    { value: 'Technical' },
    { value: 'Management' },
];

const IMAGE_URL = process.env.PUBLIC_URL + '/guide-wizard/guide-wizard-intro.png'

const GuideWizardDetails = ({ guide, onNext, onBack, validation}) => {

    const [title, setTitle] = useState({
        value: null,
        status: null,
        help: null,
    });

    const [category, setCategory] = useState({
        value: null,
        status: null,
        help: null,
    });

    const [description, setDescription] = useState(null);

    React.useEffect(() => {
        if (guide) {
            setTitle({
                ...title,
                value: guide.title
            });
            setCategory({
                ...category,
                value: guide.type
            });
            setDescription(guide.description);
        }
        // eslint-disable-next-line
    }, [guide]);

    validation.isDetailsDataValid = () => isDataValid();

    const onTitleChange = e => setTitle({
        value: e.target.value,
        status: null,
        help: null,
    })

    const onCategoryChange = value => setCategory({
        value: value,
        status: null,
        help: null,
    })

    const onDescriptionChange = e => setDescription(e.target.value)

    const isDataValid = () => {
        let valid = true;
        if (!title.value || title.value.length === 0) {
            valid = false;
            setTitle({
                ...title,
                status: 'error',
                help: "Please provide 'Title'.",
            })
        }

        if (!category.value || category.value.length === 0) {
            valid = false;
            setCategory({
                ...category,
                status: 'error',
                help: "Please provide 'Category'.",
            })
        }

        return valid
    }

    const onNextClicked = () => {
        if (!title.value || title.value.length === 0) {
            setTitle({
                ...title,
                status: 'error',
                help: "Please provide 'Title'.",
            })
        } else if (!category.value || category.value.length === 0) {
            setCategory({
                ...category,
                status: 'error',
                help: "Please provide 'Category'.",
            })
        } else {
            onNext(title.value, category.value, description)
        }
    }

    return <Row key={guide.guideId} align="middle" wrap={false}>
        <Col span={12}>
            <div className={styles.container}>
                <Alert
                    className={styles.alert}
                    message="Enter interview guide detail information so you can easily discover it among other guides."
                    type="info"
                    showIcon
                />
                <Card className={styles.card}>
                    <Form>
                        <Form.Item label="Title" {...layout}
                                   validateStatus={title.status}
                                   help={title.help}>
                            <Input
                                placeholder="Software Developer"
                                onChange={onTitleChange}
                                defaultValue={guide.title}
                            />
                        </Form.Item>
                        <Form.Item label="Category" {...layout}
                                   validateStatus={category.status}
                                   help={category.help}>
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
                        <Form.Item label="Description" {...layout}>
                            <TextArea
                                placeholder="Guide description"
                                defaultValue={guide.description}
                                onChange={onDescriptionChange}
                                autoSize
                            />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <div className={styles.buttonContainer}>
                                <Button className={styles.button} onClick={onBack}>Discard</Button>
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

export default GuideWizardDetails
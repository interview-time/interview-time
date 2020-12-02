import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import styles from "./new-interview.module.css";
import {AutoComplete, Form, DatePicker, TimePicker, Input, Button, PageHeader, Row, Col, Card} from 'antd';
import {Link} from "react-router-dom";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";

const guides = [
    {value: 'Android Developer'},
    {value: 'Java Developer'},
    {value: 'Behavioural'},
];
const STEP_DETAILS = 1
const STEP_PREVIEW = 2
const STEP_EDIT = 3

const NewInterview = () => {
    const [step, setStep] = useState(STEP_DETAILS)

    const isDetailsStep = () => step === STEP_DETAILS

    const isPreviewStep = () => step === STEP_PREVIEW

    const isEditStep = () => step === STEP_EDIT

    const onBackClicked = () => {
        if (isDetailsStep()) {
            window.history.back()
        } else if (isPreviewStep()) {
            setStep(STEP_DETAILS)
        } else if (isEditStep()) {
            setStep(STEP_PREVIEW)
        }
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        onBack={() => onBackClicked()}
        title="New Interview"
        extra={[
            <>{isPreviewStep() && <Button type="default" onClick={() => setStep(STEP_EDIT)}>
                <span className="nav-text">Customize</span>
            </Button>}</>,
            <>{isEditStep() && <Button type="default" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Preview</span>
            </Button>}</>,
            <>{isDetailsStep() && <Button type="primary" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Next</span>
            </Button>}</>,
            <>{(isPreviewStep() || isEditStep()) && <Button type="primary">
                <Link to={`/interviews`}>
                    <span className="nav-text">Finish</span>
                </Link>
            </Button>}</>
        ]}
    >
        {isDetailsStep() && <Text>
            Enter interview detail information and select guide which will be used during the interview.</Text>}
        {isPreviewStep() && <Text>
            This is a <Text strong>preview</Text> of the guide which will be used during the interview. If you want
            to make changes to the guide (only for this interview) click on <Text
            strong>customize</Text> button.</Text>}
        {isEditStep() && <Text>
            Make adjustments to this interview guide and click on the <Text strong>preview</Text> button to see the changes.</Text>}
    </PageHeader>}>
        <Row gutter={16} justify="center">
            {isDetailsStep() && <Col span={24}>
                <Card title="Interview Details" bordered={false} headStyle={{textAlign: 'center'}}>
                    <Form
                        labelCol={{span: 10}}
                        wrapperCol={{span: 14}}
                        name="basic"
                        initialValues={{remember: true}}>
                        <Form.Item label="Candidate Name">
                            <Input placeholder="Jon Doe" className={styles.input} />
                        </Form.Item>

                        <Form.Item name="date-time-picker" label="Interview Time">
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" className={styles.input} />
                        </Form.Item>

                        <Form.Item name="time-picker" label="Interview Duration">
                            <TimePicker showTime format="HH:mm" className={styles.input} />
                        </Form.Item>

                        <Form.Item label="Position">
                            <Input placeholder="Junior Software Developer" className={styles.input} />
                        </Form.Item>

                        <Form.Item label="Guide">
                            <AutoComplete
                                className={styles.input}
                                options={guides}
                                placeholder="Select guide"
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Form.Item>
                    </Form>
                </Card>
            </Col>}
            {isPreviewStep() && <Col span={24}>
                <InterviewDetailsCard />
            </Col>
            }
            {isEditStep() && <Col span={24}>
                <GuideStructureCard />
            </Col>}
        </Row>
    </Layout>
}

export default NewInterview;
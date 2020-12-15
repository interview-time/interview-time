import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import styles from "./new-interview.module.css";
import {AutoComplete, Form, DatePicker, TimePicker, Input, Button, PageHeader, Row, Col, Card, Tabs} from 'antd';
import {Link} from "react-router-dom";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";
import GuideQuestionGroup from "../../components/guide/guide-question-group";

const {TabPane} = Tabs;

const guides = [
    {value: 'Android Developer'},
    {value: 'Java Developer'},
    {value: 'Behavioural'},
];
const STEP_DETAILS = 1
const STEP_STRUCTURE = 2
const STEP_PREVIEW = 3
const STEP_QUESTIONS = 4

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const NewInterview = () => {
    const [step, setStep] = useState(STEP_DETAILS)

    const isDetailsStep = () => step === STEP_DETAILS

    const isPreviewStep = () => step === STEP_PREVIEW

    const isStructureStep = () => step === STEP_STRUCTURE

    const isQuestionsStep = () => step === STEP_QUESTIONS

    const onTabClicked = (key) => {
        if (key === TAB_DETAILS) {
            setStep(STEP_DETAILS)
        } else if (key === TAB_STRUCTURE) {
            setStep(STEP_STRUCTURE)
        }
    }

    const onBackClicked = () => {
        window.history.back()
    }

    const getActiveTab = () => {
        if (isDetailsStep()) {
            return TAB_DETAILS
        } else if (isStructureStep()) {
            return TAB_STRUCTURE
        }
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        onBack={() => onBackClicked()}
        title="New Interview"
        extra={[
            <>{(isDetailsStep() || isStructureStep()) && <Button type="default" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Preview</span>
            </Button>}</>,
            <>{isPreviewStep() && <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Edit</span>
            </Button>}</>,
            <>{isQuestionsStep() && <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Discard</span>
            </Button>}</>,
            <>{isQuestionsStep() && <Button type="primary" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Done</span>
            </Button>}</>,
            <>{(!isQuestionsStep()) && <Button type="primary">
                <Link to={`/interviews`}>
                    <span className="nav-text">Save</span>
                </Link>
            </Button>}</>
        ]}
        footer={
            <>{(isDetailsStep() || isStructureStep()) &&
            <Tabs defaultActiveKey={getActiveTab} onChange={onTabClicked}>
                <TabPane tab="Details" key={TAB_DETAILS} />
                <TabPane tab="Structure" key={TAB_STRUCTURE} />
            </Tabs>}</>
        }
    >
        {isDetailsStep() && <Text>
            Enter interview detail information and select guide which will be used during the interview.</Text>}
        {isPreviewStep() && <Text>
            This is a <Text strong>preview</Text> of the guide which will be used during the interview. If you want
            to make changes to the guide (only for this interview) click on <Text
            strong>edit</Text> button.</Text>}
        {isStructureStep() && <Text>
            Make adjustments to this interview guide and click on the <Text strong>preview</Text> button to see the
            changes.</Text>}
        {isQuestionsStep() && <Text>
            Drag and drop questions from your question bank to the question group.
        </Text>}
    </PageHeader>}>
        <Row gutter={16} justify="center">
            {isDetailsStep() && <Col className={styles.detailsCard}>
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
            {isPreviewStep() && <Col>
                <InterviewDetailsCard />
            </Col>}
            {isStructureStep() && <Col>
                <GuideStructureCard onAddQuestionClicked={() => setStep(STEP_QUESTIONS)} />
            </Col>}
            {isQuestionsStep() && <Col span={24}>
                <GuideQuestionGroup />
            </Col>}
        </Row>
    </Layout>
}

export default NewInterview;
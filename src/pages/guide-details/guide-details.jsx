import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import styles from "./guide-details.module.css";
import {Select, Form, Input, Button, PageHeader, Row, Col, Card, Tabs} from 'antd';
import {Link} from "react-router-dom";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import GuideQuestionGroup from "../../components/guide/guide-question-group";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";

const {TabPane} = Tabs;
const {TextArea} = Input;

const guides = [
    {value: 'Behavioral'},
    {value: 'Technical'},
    {value: 'Management'},
];

const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};

const tailLayout = {
    wrapperCol: {offset: 6, span: 18},
};

const STEP_DETAILS = 1
const STEP_STRUCTURE = 2
const STEP_QUESTIONS = 3
const STEP_PREVIEW = 4

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const GuideDetails = () => {
    const [step, setStep] = useState(STEP_DETAILS)

    const isDetailsStep = () => step === STEP_DETAILS

    const isPreviewStep = () => step === STEP_PREVIEW

    const isStructureStep = () => step === STEP_STRUCTURE

    const isQuestionsStep = () => step === STEP_QUESTIONS

    const onBackClicked = () => {
        window.history.back()
    }

    const onTabClicked = (key) => {
        if (key === TAB_DETAILS) {
            setStep(STEP_DETAILS)
        } else if (key === TAB_STRUCTURE) {
            setStep(STEP_STRUCTURE)
        }
    }

    const getHeaderTitle = () => {
        if (isPreviewStep()) {
            return "Interviewer Experience"
        } else {
            // TODO replace with "Edit Interview Guide" if we are editing existing guide
            return "New Interview Guide"
        }
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
        title={getHeaderTitle()}
        extra={[
            <>{(isPreviewStep()) && <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Edit</span>
            </Button>}</>,
            <>{(isDetailsStep() || isStructureStep()) &&
            <Button type="default" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Preview</span>
            </Button>}</>,
            <>{isQuestionsStep() &&
            <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Discard</span>
            </Button>}</>,
            <>{isQuestionsStep() && <Button type="primary" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Done</span>
            </Button>}</>,
            <>{(!isQuestionsStep()) && <Button type="primary">
                <Link to={`/guides`}>
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
            Enter interview guide detail information so you can easily discover it among other guides.</Text>}
        {isPreviewStep() && <Text>
            This is a <Text strong>preview</Text> of the guide which will be used during the interview. To go back click
            on <Text strong>edit</Text> button.</Text>}
        {isStructureStep() && <Text>
            Stay organized and structure the interview guide. <Text strong>Grouping</Text> questions helps to evaluate
            skills in a particular area and make a more granular assessment. Click on the <Text
            strong>preview</Text> button to see
            the changes.</Text>}
        {isQuestionsStep() && <Text>
            Drag and drop questions from your question bank to the question group.
            </Text>}
    </PageHeader>}>
        <Row gutter={16} justify="center">
            {isQuestionsStep() && <Col span={24}>
                <GuideQuestionGroup />
            </Col>}
            {isDetailsStep() && <Col className={styles.detailsCard}>
                <Card title="Guide Details" bordered={false} headStyle={{textAlign: 'center'}}>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{remember: true}}>
                        <Form.Item label="Title">
                            <Input placeholder="Software Developer" className={styles.input} />
                        </Form.Item>
                        <Form.Item label="Category">
                            <Select
                                className={styles.input}
                                options={guides}
                                showSearch
                                placeholder="Select category"
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <TextArea
                                autoSize
                                placeholder="Guide description"
                                className={styles.textArea} />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="default" danger>
                                <Link to={`/guides`}>
                                    <span className="nav-text">Delete</span>
                                </Link>
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>}
            {isPreviewStep() && <Col span={24}>
                <InterviewDetailsCard />
            </Col>}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    showRevertButton={false}
                    onAddQuestionClicked={() => setStep(STEP_QUESTIONS)} />
            </Col>}
        </Row>
    </Layout>
}

export default GuideDetails;
import React, {useState} from "react";
import Layout from "../../components/layout/layout";
import styles from "./guide-details.module.css";
import {Typography, Select, Form, Input, Button, PageHeader, Row, Col, Card, Tabs} from 'antd';
import {Link} from "react-router-dom";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";

const {Paragraph} = Typography;

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
const STEP_EDIT = 2
const STEP_PREVIEW = 3

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const GuideDetails = () => {
    const [step, setStep] = useState(STEP_DETAILS)

    const isDetailsStep = () => step === STEP_DETAILS

    const isPreviewStep = () => step === STEP_PREVIEW

    const isEditStep = () => step === STEP_EDIT

    const onBackClicked = () => {
        window.history.back()
    }

    const onTabClicked = (key) => {
        if (key === TAB_DETAILS) {
            setStep(STEP_DETAILS)
        } else if (key === TAB_STRUCTURE) {
            setStep(STEP_EDIT)
        }
    }

    const getHeaderTitle = () => {
        if (isDetailsStep() || isEditStep()) {
            // TODO replace with "Edit Interview Guide" based on state
            return "New Interview Guide"
        } else if (isPreviewStep()) {
            return "Interviewer Experience"
        }
    }

    const getActiveTab = () => {
        if (isDetailsStep()) {
            return TAB_DETAILS
        } else if (isEditStep()) {
            return TAB_STRUCTURE
        }
    }

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        onBack={() => onBackClicked()}
        title={getHeaderTitle()}
        extra={[
            <>{(isPreviewStep()) && <Button type="default" onClick={() => setStep(STEP_EDIT)}>
                <span className="nav-text">Edit</span>
            </Button>}</>,
            <>{(isDetailsStep() || isEditStep()) && <Button type="default" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Preview</span>
            </Button>}</>,
            <Button type="primary">
                <Link to={`/guides`}>
                    <span className="nav-text">Save</span>
                </Link>
            </Button>
        ]}
        footer={
            <>{(isDetailsStep() || isEditStep()) && <Tabs defaultActiveKey={getActiveTab} onChange={onTabClicked}>
                <TabPane tab="Details" key={TAB_DETAILS} />
                <TabPane tab="Structure" key={TAB_STRUCTURE} />
            </Tabs>}</>
        }
    >
        {isDetailsStep() && <Text>
            Enter interview guide detail information so you can easily discover it among other guides.</Text>}
        {isPreviewStep() && <Text>
            This is a <Text strong>preview</Text> of the guide which will be used during the interview. To go back click on <Text
            strong>edit</Text> button.</Text>}
        {isEditStep() && <Text>
            Stay organized and structure the interview guide. <Text strong>Grouping</Text> questions helps to evaluate
            skills in a
            particular area and make a more granular assessment. Click on the <Text strong>preview</Text> button to see
            the changes.</Text>}
    </PageHeader>}>
        <Row gutter={16} justify="center">
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
            </Col>
            }
            {isEditStep() && <Col>
                <GuideStructureCard showRevertButton={false} />
            </Col>}
        </Row>
    </Layout>
}

export default GuideDetails;
import React, {useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {addGuide, deleteGuide, loadGuides, updateGuide} from "../../store/guides/actions";
import styles from "./guide-details.module.css";
import Layout from "../../components/layout/layout";
import {Button, Card, Col, Form, Input, PageHeader, Row, Select, Tabs} from 'antd';
import Text from "antd/es/typography/Text";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import GuideQuestionGroup from "../../components/guide/guide-question-group";
import InterviewDetailsCard from "../../components/interview/interview-details-card";

const {TabPane} = Tabs;
const {TextArea} = Input;

const categories = [
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

const emptyGuide = {
    id: undefined,
    title: '',
    image: '',
    totalQuestions: 0,
    totalInterviews: 0,
    structure: {
        header: '',
        footer: '',
        groups: []
    }
}

const GuideDetails = ({guides, loading, loadGuides, addGuide, deleteGuide, updateGuide}) => {
    const [step, setStep] = useState(STEP_DETAILS);
    const [currentGuide, setCurrentGuide] = useState(emptyGuide);
    const [form] = Form.useForm();
    const history = useHistory();
    const {id} = useParams();

    const isNewGuideFlow = () => !id;

    React.useEffect(() => {
        if (!isNewGuideFlow() && !currentGuide.id && !loading) {
            const guide = guides.find(guide => guide.id === id);
            if (guide) {
                setCurrentGuide(guide)
                form.setFieldsValue({
                    title: guide.title,
                    category: guide.category,
                    description: guide.description
                })
            }
        }
    }, [guides, id]);

    React.useEffect(() => {
        if (!isNewGuideFlow() && guides.length === 0 && !loading) {
            loadGuides();
        }
    });

    const isDetailsStep = () => step === STEP_DETAILS

    const isPreviewStep = () => step === STEP_PREVIEW

    const isStructureStep = () => step === STEP_STRUCTURE

    const isQuestionsStep = () => step === STEP_QUESTIONS

    const getHeaderTitle = () => {
        if (isPreviewStep()) {
            return "Interviewer Experience"
        } else {
            return isNewGuideFlow() ? "New Interview Guide" : "Edit Interview Guide";
        }
    }

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

    const getActiveTab = () => {
        if (isDetailsStep()) {
            return TAB_DETAILS
        } else if (isStructureStep()) {
            return TAB_STRUCTURE
        }
    }

    const onDeleteClicked = () => {
        deleteGuide(currentGuide.id);
        history.push("/guides");
    }

    const onSaveClicked = () => {
        const guide = {
            ...currentGuide,
            title: form.getFieldValue("title"),
            description: form.getFieldValue("description"),
            category: form.getFieldValue("category"),
        }
        if (isNewGuideFlow()) {
            addGuide(guide);
        } else {
            updateGuide(guide);
        }
        history.push("/guides");
    }

    const createDetailsCard = <Col className={styles.detailsCard}>
        <Card title="Guide Details" bordered={false} headStyle={{textAlign: 'center'}}>
            <Form
                form={form}
                name="details"
                {...layout}>
                <Form.Item label="Title" name="title">
                    <Input
                        placeholder="Software Developer"
                        className={styles.input}
                    />
                </Form.Item>
                <Form.Item label="Category" name="category">
                    <Select
                        placeholder="Select category"
                        className={styles.input}
                        options={categories}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <TextArea
                        placeholder="Guide description"
                        className={styles.textArea}
                        autoSize
                    />
                </Form.Item>
                {!isNewGuideFlow() && <Form.Item {...tailLayout}>
                    <Button type="default" danger onClick={onDeleteClicked}>Delete</Button>
                </Form.Item>}
            </Form>
        </Card>
    </Col>

    return <Layout pageHeader={<PageHeader
        className={styles.pageHeader}
        onBack={() => onBackClicked()}
        title={getHeaderTitle()}
        extra={[
            <>{(isPreviewStep()) && <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Edit</span>
            </Button>}</>,
            <>{(isDetailsStep() || isStructureStep()) && <Button type="default" onClick={() => setStep(STEP_PREVIEW)}>
                <span className="nav-text">Preview</span>
            </Button>}</>,
            <>{isQuestionsStep() && <Button type="default" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Discard</span>
            </Button>}</>,
            <>{isQuestionsStep() && <Button type="primary" onClick={() => setStep(STEP_STRUCTURE)}>
                <span className="nav-text">Done</span>
            </Button>}</>,
            <>{(!isQuestionsStep()) && <Button type="primary" onClick={onSaveClicked}>Save</Button>}</>
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
            {isDetailsStep() && createDetailsCard}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    structure={currentGuide.structure}
                    onChanges={structure => {
                        setCurrentGuide({
                            ...currentGuide,
                            structure: structure
                        })
                    }}
                    onAddQuestionClicked={() => setStep(STEP_QUESTIONS)} />
            </Col>}
            {isPreviewStep() && <Col span={24}><InterviewDetailsCard /></Col>}
            {isQuestionsStep() && <Col span={24}><GuideQuestionGroup /></Col>}
        </Row>
    </Layout>
}

const mapStateToProps = state => {
    const {guides, loading} = state.guides || {};

    return {guides, loading};
};

export default connect(mapStateToProps, {loadGuides, addGuide, deleteGuide, updateGuide})(GuideDetails);
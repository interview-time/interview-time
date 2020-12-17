import React, {useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import store from "../../store";
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

const GuideDetails = ({guides, loading, loadGuides}) => {
    const [step, setStep] = useState(STEP_DETAILS);
    const [currentGuide, setCurrentGuide] = useState({
        id: undefined,
        title: '',
        image: '',
        questions: [],
        interviews: []
    });
    const history = useHistory();
    const {id} = useParams();

    const isNewGuideFlow = () => !id;

    if (!isNewGuideFlow() && !currentGuide.id && guides.length !== 0) {
        setCurrentGuide(guides.find(guide => guide.id === id))
    }

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
        store.dispatch(deleteGuide(currentGuide.id));
        history.push("/guides")
    }

    const onSaveClicked = () => {
        if (isNewGuideFlow()) {
            store.dispatch(addGuide(currentGuide));
        } else {
            store.dispatch(updateGuide(currentGuide));
        }
        history.push("/guides")
    }

    const onTitleChanges = event => {
        setCurrentGuide({...currentGuide, title: event.target.value})
    };

    const onDescriptionChanges = event => {
        setCurrentGuide({...currentGuide, description: event.target.value})
    };

    const onCategoryChanges = category => {
        setCurrentGuide({...currentGuide, category: category})
    };

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
            {isDetailsStep() && <Col className={styles.detailsCard}>
                <Card title="Guide Details" bordered={false} headStyle={{textAlign: 'center'}}>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{remember: true}}>
                        <Form.Item label="Title">
                            <Input
                                placeholder="Software Developer"
                                className={styles.input}
                                defaultValue={currentGuide.title}
                                onChange={onTitleChanges}
                            />
                        </Form.Item>
                        <Form.Item label="Category">
                            <Select
                                placeholder="Select category"
                                className={styles.input}
                                defaultValue={currentGuide.category}
                                options={categories}
                                onChange={onCategoryChanges}
                                showSearch
                                filterOption={(inputValue, option) =>
                                    option.value.toLocaleLowerCase().includes(inputValue)
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <TextArea
                                placeholder="Guide description"
                                className={styles.textArea}
                                defaultValue={currentGuide.description}
                                onChange={onDescriptionChanges}
                                autoSize
                            />
                        </Form.Item>
                        {!isNewGuideFlow() && <Form.Item {...tailLayout}>
                            <Button type="default" danger onClick={onDeleteClicked}>Delete</Button>
                        </Form.Item>}
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
            {isQuestionsStep() && <Col span={24}>
                <GuideQuestionGroup />
            </Col>}
        </Row>
    </Layout>
}

const mapStateToProps = state => {
    const {guides, loading} = state.guides || {};

    return {guides, loading};
};

export default connect(mapStateToProps, {loadGuides})(GuideDetails);
import React, {useState} from "react";
import {connect} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import moment from 'moment';
import Layout from "../../components/layout/layout";
import styles from "./interview-details.module.css";
import {addInterview, deleteInterview, loadInterviews, updateInterview} from "../../store/interviews/actions";
import {Button, Card, Col, DatePicker, Form, Input, PageHeader, Row, Select, Tabs} from 'antd';
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

const layout = {
    labelCol: {span: 10},
    wrapperCol: {span: 14},
};

const tailLayout = {
    wrapperCol: {offset: 10, span: 14},
};

const STEP_DETAILS = 1
const STEP_STRUCTURE = 2
const STEP_PREVIEW = 3
const STEP_QUESTIONS = 4

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const DATE_FORMAT = "YYYY-MM-DD HH:mm"

const emptyInterview = {
    id: undefined,
    name: '',
    position: '',
    guide: '',
    date: '',
    tags: [],
    status: '',
    structure: {
        header: '',
        footer: '',
        groups: []
    }
}

const InterviewDetails = ({interviews, loading, loadInterviews, addInterview, deleteInterview, updateInterview}) => {
    const [step, setStep] = useState(STEP_DETAILS)
    const [interview, setInterview] = useState(emptyInterview);
    const [form] = Form.useForm();
    const history = useHistory();
    const {id} = useParams();

    const isNewInterviewFlow = () => !id;

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.id && !loading) {
            const interview = interviews.find(interview => interview.id === id);
            if (interview) {
                setInterview(interview)
                form.setFieldsValue({
                    name: interview.name,
                    position: interview.position,
                    guide: interview.guide,
                    date: moment(interview.date)
                })
            }
        }
    }, [interviews, id]);

    React.useEffect(() => {
        if (!isNewInterviewFlow() && interviews.length === 0 && !loading) {
            loadInterviews();
        }
    });

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

    const onDeleteClicked = () => {
        deleteInterview(interview.id);
        history.push("/interviews");
    }

    const onSaveClicked = () => {
        const updatedInterview = {
            ...interview,
            name: form.getFieldValue("name"),
            position: form.getFieldValue("position"),
            guide: form.getFieldValue("guide"),
            date: form.getFieldValue("date").format(DATE_FORMAT),
            status: 'Scheduled'
        }
        if (isNewInterviewFlow()) {
            addInterview(updatedInterview);
        } else {
            updateInterview(updatedInterview);
        }
        history.push("/interviews");
    }

    const createDetailsCard = <Col className={styles.detailsCard}>
        <Card title="Interview Details" bordered={false} headStyle={{textAlign: 'center'}}>
            <Form
                {...layout}
                form={form}
                initialValues={{remember: true}}>
                <Form.Item label="Candidate Name" name="name">
                    <Input placeholder="Jon Doe" className={styles.input} />
                </Form.Item>

                <Form.Item name="date" label="Interview Time">
                    <DatePicker showTime format={DATE_FORMAT} className={styles.input} />
                </Form.Item>

                <Form.Item label="Position" name="position">
                    <Input placeholder="Junior Software Developer" className={styles.input} />
                </Form.Item>

                <Form.Item label="Guide" name="guide">
                    <Select
                        className={styles.input}
                        options={guides}
                        showSearch
                        placeholder="Select guide"
                        filterOption={(inputValue, option) =>
                            option.value.toLocaleLowerCase().includes(inputValue)
                        }
                    />
                </Form.Item>
                {!isNewInterviewFlow() && <Form.Item {...tailLayout}>
                    <Button type="default" danger onClick={onDeleteClicked}>Delete</Button>
                </Form.Item>}
            </Form>
        </Card>
    </Col>

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
            {isDetailsStep() && createDetailsCard}
            {isPreviewStep() && <Col><InterviewDetailsCard /></Col>}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    structure={interview.structure}
                    onChanges={structure => {
                        setInterview({
                            ...interview,
                            structure: structure
                        })
                    }}
                    onAddQuestionClicked={() => setStep(STEP_QUESTIONS)} />
            </Col>}
            {isQuestionsStep() && <Col span={24}>
                <GuideQuestionGroup />
            </Col>}
        </Row>
    </Layout>
}

const mapStateToProps = state => {
    const {interviews, loading} = state.interviews || {};

    return {interviews, loading};
};

export default connect(mapStateToProps, {
    loadInterviews,
    addInterview,
    deleteInterview,
    updateInterview
})(InterviewDetails);
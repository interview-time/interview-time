import React, {useState} from "react";
import {connect} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import moment from 'moment';
import Layout from "../../components/layout/layout";
import styles from "./interview-details.module.css";
import {addInterview, deleteInterview, loadInterviews, updateInterview} from "../../store/interviews/actions";
import {loadGuides} from "../../store/guides/actions";
import {Button, Card, Col, DatePicker, Form, Input, message, Modal, PageHeader, Row, Select, Tabs} from 'antd';
import GuideStructureCard from "../../components/guide/guide-structure-card";
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";
import GuideQuestionGroup from "../../components/guide/guide-question-group";
import lang from "lodash/lang";
import Arrays from "lodash";
import { DATE_FORMAT_SERVER, DATE_FORMAT_DISPLAY, Status } from "../common/constants";

const {TabPane} = Tabs;

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

const emptyInterview = {
    id: undefined,
    candidate: '',
    position: '',
    guideId: '',
    interviewDateTime: '',
    structure : {
        groups: []
    }
}

const InterviewDetails = ({
                              interviews,
                              guides,
                              loading,
                              loadInterviews,
                              addInterview,
                              deleteInterview,
                              updateInterview,
                              loadGuides
                          }) => {
    const [step, setStep] = useState(STEP_DETAILS)
    const [interview, setInterview] = useState(emptyInterview);
    const [form] = Form.useForm();
    const history = useHistory();
    const header = React.createRef();
    const {id} = useParams();

    const isNewInterviewFlow = () => !id;

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.interviewId && !loading) {
            const interview = interviews.find(interview => interview.interviewId === id);
            if (interview) {
                setInterview(lang.cloneDeep(interview))
            }
        }
        // eslint-disable-next-line 
    }, [interviews, id]);

    React.useEffect(() => {
        if (interview.interviewId) {
            const guide = guides.find((guide) => guide.guideId === interview.guideId)
            if (guide) {
                form.setFieldsValue({
                    guide: guide.title,
                })
            }
        }
        // eslint-disable-next-line 
    }, [interview, guides]);

    React.useEffect(() => {
        if (!isNewInterviewFlow() && interviews.length === 0 && !loading) {
            loadInterviews();
            loadGuides()
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
        Modal.confirm({
            title: "If you have unsaved changes, they will be lost. Are you sure that you want to exit?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                history.push("/interviews");
            }
        })
    }

    const getActiveTab = () => {
        if (isDetailsStep()) {
            return TAB_DETAILS
        } else if (isStructureStep()) {
            return TAB_STRUCTURE
        }
    }

    const onDeleteClicked = () => {
        deleteInterview(interview.interviewId);
        history.push("/interviews");
        message.success(`Interview '${interview.candidate}' removed.`);
    }

    const onSaveClicked = () => {
        let interview = createUpdatedInterview();

        if (lang.isEmpty(interview.candidate)) {
            Modal.warn({
                title: "Interview 'candidate name' must not be empty.",
            })
        } else if (lang.isEmpty(interview.position)) {
            Modal.warn({
                title: "Interview 'position' must not be empty.",
            })
        } else if (lang.isEmpty(interview.guideId)) {
            Modal.warn({
                title: "Interview 'guide' must not be empty.",
            })
        } else if (lang.isEmpty(interview.interviewDateTime)) {
            Modal.warn({
                title: "Interview 'date' must not be empty.",
            })
        } else {
            if (isNewInterviewFlow()) {
                addInterview(interview);
                message.success(`Interview '${interview.candidate}' created.`);
            } else {
                updateInterview(interview);
                message.success(`Interview '${interview.candidate}' updated.`);
            }
            history.push("/interviews");
        }
    }

    const onPositionChange = e => {
        interview.position = e.target.value
    };

    const onCandidateChange = e => {
        interview.candidate = e.target.value
    };

    const onDateChange = (date, dateString) => {
        console.log(date)
        console.log(dateString)

        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER)
    };

    const createUpdatedInterview = () => {
        const guideTitle = form.getFieldValue("guide")
        const guide = Arrays.find(guides, (guide) => guide.title === guideTitle)

        return {
            ...lang.cloneDeep(interview),
            status: Status.NEW,
            guideId: guide ? guide.guideId : '',
        };
    };

    const createDetailsCard = <Col key={interview.interviewId} className={styles.detailsCard}>
        <Card title="Interview Details" bordered={false} headStyle={{textAlign: 'center'}}>
            <Form
                {...layout}
                form={form}
                initialValues={{remember: true}}>
                <Form.Item label="Candidate Name">
                    <Input placeholder="Jon Doe" className={styles.input}
                           defaultValue={interview.candidate} onChange={onCandidateChange}/>
                </Form.Item>

                <Form.Item name="date" label="Interview Date">
                    <DatePicker showTime format={DATE_FORMAT_DISPLAY} className={styles.input}
                                defaultValue={moment(interview.interviewDateTime)} onChange={onDateChange} />
                </Form.Item>

                <Form.Item label="Position">
                    <Input placeholder="Junior Software Developer" className={styles.input}
                           defaultValue={interview.position} onChange={onPositionChange} />
                </Form.Item>

                <Form.Item label="Guide" name="guide">
                    <Select
                        className={styles.input}
                        options={guides.map(guide => ({
                            value: guide.title
                        }))}
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

    return <Layout pageHeader={<div ref={header}><PageHeader
        className={styles.pageHeader}
        onBack={() => onBackClicked()}
        title={isNewInterviewFlow() ? "New Interview" : "Edit Interview"}
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
    </PageHeader></div>}>
        <Row gutter={16} justify="center">
            {isDetailsStep() && createDetailsCard}
            {isPreviewStep() && <Col span={24}>
                <InterviewDetailsCard interview={interview} header={header} disabled={true} />
            </Col>}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    structure={interview.structure}
                    onChange={structure => {
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
    const {guides} = state.guides || {};

    return {interviews, guides: Arrays.sortBy(guides, ['title']), loading};
};

export default connect(mapStateToProps, {
    loadInterviews,
    addInterview,
    deleteInterview,
    updateInterview,
    loadGuides
})(InterviewDetails);
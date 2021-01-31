import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from 'moment';
import Layout from "../../components/layout/layout";
import styles from "./interview-details.module.css";
import { addInterview, deleteInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadQuestionBank } from "../../store/question-bank/actions";
import { loadGuides } from "../../store/guides/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, DatePicker, Drawer, Form, Input, message, Modal, PageHeader, Row, Tabs } from 'antd';
import InterviewDetailsCard from "../../components/interview/interview-details-card";
import Text from "antd/es/typography/Text";
import lang from "lodash/lang";
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_SERVER, Status } from "../../components/utils/constants";
import GuideStructureCard from "../../components/guide/guide-structure-card";
import Collection from "lodash/collection";
import InterviewQuestionGroup from "../../components/interview/interview-question-group";
import Arrays from "lodash";

const { TabPane } = Tabs;

const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
};

const STEP_DETAILS = 1
const STEP_STRUCTURE = 2
const STEP_QUESTIONS = 3

const TAB_DETAILS = "details"
const TAB_STRUCTURE = "structure"

const InterviewDetails = () => {

    const emptyInterview = {
        interviewId: undefined,
        candidate: '',
        position: '',
        guideId: '',
        interviewDateTime: '',
        structure: {
            groups: []
        }
    }

    const {interviews, interviewsLoading} = useSelector(state => ({
        interviews: state.interviews.interviews,
        interviewsLoading: state.interviews.loading
    }), shallowEqual);

    const {categories, questions, questionsLoading} = useSelector(state => ({
        categories: state.questionBank.categories.sort(),
        questions: Collection.sortBy(state.questionBank.questions, ['question']),
        questionsLoading: state.questionBank.loading
    }), shallowEqual);

    const {guides, guidesLoading} = useSelector(state => ({
        guides: state.guides.guides,
        guidesLoading: state.guides.loading
    }), shallowEqual);

    const dispatch = useDispatch();

    const [step, setStep] = useState(STEP_DETAILS)
    const [interview, setInterview] = useState(emptyInterview);

    const [selectedGroup, setSelectedGroup] = useState({
        group: {},
        questions: []
    });

    const [preview, setPreview] = useState({
        placement: 'right',
        visible: false
    });

    const history = useHistory();
    const { id } = useParams();

    const isNewInterviewFlow = () => !id;

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.interviewId && !interviewsLoading) {
            const interview = interviews.find(interview => interview.interviewId === id);
            if (interview) {
                setInterview(lang.cloneDeep(interview))
            }
        }
        // eslint-disable-next-line 
    }, [interviews, id]);

    React.useEffect(() => {
        // initial data loading
        if (!isNewInterviewFlow() && interviews.length === 0 && !interviewsLoading) {
            dispatch(loadInterviews());
        }
        if (questions.length === 0 && !questionsLoading) {
            dispatch(loadQuestionBank())
        }

        if (guides.length === 0 && !guidesLoading) {
            dispatch(loadGuides())
        }
        // eslint-disable-next-line
    }, []);

    const isDetailsStep = () => step === STEP_DETAILS

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
        dispatch(deleteInterview(interview.interviewId));
        history.push("/interviews");
        message.success(`Interview '${interview.candidate}' removed.`);
    }

    const onSaveClicked = () => {
        let interview = createUpdatedInterview();
        const emptyGroupName = Arrays.find(interview.structure.groups, (group) => {
            return !group.name || group.name.length === 0
        })

        if (lang.isEmpty(interview.candidate)) {
            Modal.warn({
                title: "Please provide 'Candidate Name'.",
            })
        } else if (lang.isEmpty(interview.position)) {
            Modal.warn({
                title: "Please provide 'Position'.",
            })
        } else if (lang.isEmpty(interview.interviewDateTime)) {
            Modal.warn({
                title: "Please provide 'Interview Date'.",
            })
        } else if (emptyGroupName) {
            Modal.warn({
                title: "Please provide 'Question Group' name.",
            })
        } else {
            if (isNewInterviewFlow()) {
                dispatch(addInterview(interview));
                message.success(`Interview '${interview.candidate}' created.`);
            } else {
                dispatch(updateInterview(interview));
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

    const onDateChange = (date) => {
        interview.interviewDateTime = date.utc().format(DATE_FORMAT_SERVER)
    };

    const onAddQuestionClicked = (group) => {
        setStep(STEP_QUESTIONS);
        setSelectedGroup({
            ...selectedGroup,
            group: group
        })
    }

    const onAddQuestionDiscard = () => {
        setStep(STEP_STRUCTURE)
        setSelectedGroup({
            group: {},
            questions: []
        })
    }
    const onAddQuestionConfirmed = () => {
        const updatedInterview = lang.cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === selectedGroup.group.groupId)
            .questions = lang.cloneDeep(selectedGroup.questions)

        setStep(STEP_STRUCTURE)
        setInterview(updatedInterview)
    }

    const onGuideChange = (guide) => {
        const structure = lang.cloneDeep(guide.structure)
        structure.groups.forEach((group, index) =>
            structure.groups[index].questions
                = group.questions.map(questionId => questions.find(item => item.questionId === questionId))
        )
        setInterview({
            ...interview,
            guideId: guide.guideId,
            structure: structure
        })
    }

    const onGroupQuestionsChange = (groupQuestions) => {
        setSelectedGroup({
            ...selectedGroup,
            questions: groupQuestions
        })
    }

    const onGroupNameChanges = (groupId, groupName) => {
        interview.structure.groups.find(group => group.groupId === groupId).name = groupName
    };

    const onAddGroupClicked = () => {
        const newGroup = {
            groupId: Date.now().toString(),
            questions: []
        }

        let newInterview = lang.cloneDeep(interview)
        newInterview.structure.groups.push(newGroup)
        setInterview(newInterview)
    }

    const onRemoveGroupClicked = id => {
        let newInterview = lang.cloneDeep(interview)
        newInterview.structure.groups = newInterview.structure.groups.filter(group => group.groupId !== id)
        setInterview(newInterview)
    }

    const onHeaderChanged = event => {
        interview.structure.header = event.target.value
    }

    const onFooterChanged = event => {
        interview.structure.footer = event.target.value
    }

    const createUpdatedInterview = () => {
        return {
            ...interview,
            status: Status.NEW,
        };
    };

    const onPreviewClosed = () => {
        setPreview({
            ...preview,
            visible: false
        })
    };

    const onPreviewClicked = () => {
        setPreview({
            ...preview,
            visible: true
        })
    }

    const createDetailsCard = <Col key={interview.interviewId} className={styles.detailsCard}>
        <Card title="Interview Details" bordered={false} headStyle={{ textAlign: 'center' }}>
            <Form {...layout} preserve={false}>
                <Form.Item label="Candidate Name">
                    <Input placeholder="Jon Doe" className={styles.input}
                           defaultValue={interview.candidate} onChange={onCandidateChange} />
                </Form.Item>

                <Form.Item name="date" label="Interview Date">
                    <DatePicker showTime
                                allowClear={false}
                                format={DATE_FORMAT_DISPLAY}
                                className={styles.input}
                                defaultValue={interview.interviewDateTime ? moment(interview.interviewDateTime) : ''}
                                onChange={onDateChange} />
                </Form.Item>

                <Form.Item label="Position">
                    <Input placeholder="Junior Software Developer" className={styles.input}
                           defaultValue={interview.position} onChange={onPositionChange} />
                </Form.Item>

                {!isNewInterviewFlow() && <Form.Item {...tailLayout}>
                    <Button type="default" danger onClick={onDeleteClicked}>Delete</Button>
                </Form.Item>}
            </Form>
        </Card>
    </Col>

    return <Layout pageHeader={<>
        {(isDetailsStep() || isStructureStep()) && <PageHeader
            className={styles.pageHeader}
            onBack={() => onBackClicked()}
            title={isNewInterviewFlow() ? "New Interview" : "Edit Interview"}
            extra={[
                <Button type="default" onClick={onPreviewClicked}>
                    <span className="nav-text">Preview</span>
                </Button>,
                <Button type="primary" onClick={onSaveClicked}>Save</Button>
            ]}
            footer={
                <Tabs defaultActiveKey={getActiveTab} onChange={onTabClicked}>
                    <TabPane tab="Details" key={TAB_DETAILS} />
                    <TabPane tab="Structure" key={TAB_STRUCTURE} />
                </Tabs>
            }
        >
            {isDetailsStep() && <Text>
                Enter interview detail information and select guide which will be used during the interview.</Text>}
            {isStructureStep() &&
            <Text>
                Stay organized and structure the interview. <Text strong>Grouping</Text> questions helps
                to evaluate skills in a particular area and make a more granular assessment. Click on the <Text
                strong>preview</Text> button to see the changes.</Text>}
        </PageHeader>}

        {isQuestionsStep() && <PageHeader
            className={styles.pageHeader}
            onBack={onAddQuestionDiscard}
            title="Add questions to question group"
            extra={[
                <Button type="default" onClick={onAddQuestionDiscard}>
                    <span className="nav-text">Discard</span>
                </Button>,
                <Button type="primary" onClick={onAddQuestionConfirmed}>
                    <span className="nav-text">Done</span>
                </Button>
            ]}
        >
            <Text>Click + button to add questions from your question bank to the question group.</Text>
        </PageHeader>}

    </>}>
        <Row gutter={16} justify="center">
            {isDetailsStep() && createDetailsCard}
            {isStructureStep() && <Col>
                <GuideStructureCard
                    guides={guides}
                    structure={interview.structure}
                    onHeaderChanged={onHeaderChanged}
                    onFooterChanged={onFooterChanged}
                    onAddGroupClicked={onAddGroupClicked}
                    onRemoveGroupClicked={onRemoveGroupClicked}
                    onGroupNameChanges={onGroupNameChanges}
                    onGuideChange={onGuideChange}
                    onAddQuestionClicked={onAddQuestionClicked}
                />
            </Col>}
            {isQuestionsStep() && <Col span={24}>
                <InterviewQuestionGroup
                    categories={categories}
                    questions={questions}
                    group={selectedGroup.group}
                    onGroupQuestionsChange={onGroupQuestionsChange}
                />
            </Col>}
            <Drawer
                title="Interview Experience"
                width="90%"
                closable={true}
                destroyOnClose={true}
                onClose={onPreviewClosed}
                drawerStyle={{ backgroundColor: "#F0F2F5" }}
                placement={preview.placement}
                visible={preview.visible}
                key={preview.placement}>
                <InterviewDetailsCard interview={interview} disabled={true} />
            </Drawer>
        </Row>
    </Layout>
}
export default InterviewDetails
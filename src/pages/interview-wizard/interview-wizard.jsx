import styles from "./interview-wizard.module.css";
import Layout from "../../components/layout/layout";
import { Drawer, message, PageHeader, Spin, Steps } from "antd";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Collection from "lodash/collection";
import lang, { cloneDeep } from "lodash/lang";
import { addInterview, loadInterviews, updateInterview } from "../../store/interviews/actions";
import { loadQuestionBank } from "../../store/question-bank/actions";
import { loadTemplates } from "../../store/templates/actions";
import InterviewWizardDetails from "./interview-wizard-details";
import TemplateWizardIntro from "../template-wizard/template-wizard-intro";
import TemplateWizardSummary from "../template-wizard/template-wizard-summary";
import { Status } from "../../components/utils/constants";
import TemplateWizardQuestions from "../template-wizard/template-wizard-questions";
import TemplateQuestions from "../template-wizard/template-questions";
import InterviewDetailsCard from "../interview/interview-details-card";
import CreateTemplateModal from "./create-template-modal";

const { Step } = Steps;

const STEP_DETAILS = 0
const STEP_INTRO = 1
const STEP_QUESTIONS = 2
const STEP_SUMMARY = 3

const InterviewWizard = () => {

    const emptyInterview = {
        interviewId: undefined,
        status: Status.NEW,
        structure: {
            header: "Take 10 minutes to introduce yourself and make the candidate comfortable.",
            footer: "Allow 10 minutes at the end for the candidate to ask questions.",
            groups: [
                {
                    groupId: "1",
                    name: "Software Design",
                    questions: []
                },
                {
                    groupId: "2",
                    name: "Problem Solving",
                    questions: []
                }
            ],
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

    const [step, setStep] = useState(STEP_DETAILS);
    const [interview, setInterview] = useState(emptyInterview);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [createGuideVisible, setCreateGuideVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();

    const dispatch = useDispatch();

    const history = useHistory();
    const { id } = useParams();

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(lang.cloneDeep(
                interviews.find(interview => interview.interviewId === id)
            ))
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
            dispatch(loadTemplates())
        }
        // eslint-disable-next-line
    }, []);

    const isNewInterviewFlow = () => !id;

    const isDetailsStep = () => step === STEP_DETAILS;

    const isIntroStep = () => step === STEP_INTRO;

    const isQuestionsStep = () => step === STEP_QUESTIONS;

    const isSummaryStep = () => step === STEP_SUMMARY;

    const onNext = () => {
        setStep(step + 1)
    }

    const onBack = () => {
        setStep(step - 1)
    }

    const onDiscard = () => {
        history.push("/interviews")
    }

    const onPreviewClosed = () => {
        setPreviewVisible(false)
    };

    const onPreviewClicked = () => {
        setPreviewVisible(true)
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

    const onAddQuestionClicked = (group) => {
        setSelectedGroup(cloneDeep(group))
        setQuestionsVisible(true)
    }

    const onQuestionsClosed = () => {
        const updatedInterview = lang.cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === selectedGroup.groupId)
            .questions = lang.cloneDeep(selectedGroup.questions)

        setQuestionsVisible(false)
        setInterview(updatedInterview)
    };

    const onSave = () => {
        if(!interview.guideId) {
            setCreateGuideVisible(true)
        } else {
            saveInterview()
        }
    }

    const saveInterview = () => {
        if (isNewInterviewFlow()) {
            dispatch(addInterview(interview));
            message.success(`Interview '${interview.candidate}' created.`);
        } else {
            dispatch(updateInterview(interview));
            message.success(`Interview '${interview.candidate}' updated.`);
        }
        history.push("/interviews");
    }

    const onCloseCreateGuideModal = () => {
        setCreateGuideVisible(false)
        saveInterview()
    }

    return <Layout pageHeader={
        <PageHeader
            className={styles.pageHeader}
            title={isNewInterviewFlow() ? "New Interview" : "Edit Interview"}
        >
            <Steps current={step}>
                <Step title="Interview Details" />
                <Step title="Intro Section" />
                <Step title="Questions Section" />
                <Step title="Summary Section" />
            </Steps>
        </PageHeader>
    }>
        <Spin spinning={guidesLoading || questionsLoading || interviewsLoading}>
            {isDetailsStep() && <InterviewWizardDetails
                interview={interview}
                guides={guides}
                questions={questions}
                onNext={onNext}
                onDiscard={onDiscard}
                onPreview={onPreviewClicked}
            />}
            {isIntroStep() && <TemplateWizardIntro
                interview={interview}
                onNext={onNext}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}
            {isQuestionsStep() && <TemplateWizardQuestions
                interview={interview}
                onNext={onNext}
                onBack={onBack}
                onPreview={onPreviewClicked}
                onAddGroupClicked={onAddGroupClicked}
                onRemoveGroupClicked={onRemoveGroupClicked}
                onGroupNameChanges={onGroupNameChanges}
                onAddQuestionClicked={onAddQuestionClicked}
            />}
            {isSummaryStep() && <TemplateWizardSummary
                interview={interview}
                onSave={onSave}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}

            <Drawer
                title="Interview Experience"
                width="90%"
                closable={true}
                destroyOnClose={true}
                onClose={onPreviewClosed}
                placement='right'
                visible={previewVisible}>
                <InterviewDetailsCard interview={interview} />
            </Drawer>

            <Drawer
                title="Add Questions"
                width="90%"
                closable={true}
                destroyOnClose={true}
                onClose={onQuestionsClosed}
                placement='right'
                visible={questionsVisible}>
                <TemplateQuestions
                    interview={interview}
                    selectedGroup={selectedGroup}
                    questions={questions}
                    categories={categories}
                />
            </Drawer>

            <CreateTemplateModal
                visible={createGuideVisible}
                guides={guides}
                guidesLoading={guidesLoading}
                interview={interview}
                onClose={onCloseCreateGuideModal}
            />
        </Spin>
    </Layout>
}

export default InterviewWizard
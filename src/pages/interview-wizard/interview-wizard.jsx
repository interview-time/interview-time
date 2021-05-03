import styles from "./interview-wizard.module.css";
import Layout from "../../components/layout/layout";
import { message, Modal, PageHeader, Spin, Steps } from "antd";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { flatMap } from "lodash/collection";
import { cloneDeep } from "lodash/lang";
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
import { routeInterviews } from "../../components/utils/route";
import { connect } from "react-redux";
import { findInterview } from "../../components/utils/converters";
import { personalEvent } from "../../analytics";

const { Step } = Steps;

const STEP_DETAILS = 0
const STEP_INTRO = 1
const STEP_QUESTIONS = 2
const STEP_SUMMARY = 3

const InterviewWizard = (
    {
        interviews,
        questions,
        categories,
        guides,
        loading,
        addInterview,
        loadInterviews,
        updateInterview,
        loadQuestionBank,
        loadTemplates
    }) => {

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

    const [step, setStep] = useState(STEP_DETAILS);
    const [interview, setInterview] = useState(emptyInterview);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [createGuideVisible, setCreateGuideVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();

    const history = useHistory();
    const { id } = useParams();

    React.useEffect(() => {
        if (!isNewInterviewFlow() && !interview.interviewId && interviews.length !== 0) {
            setInterview(cloneDeep(findInterview(id, interviews)))
        }
        // eslint-disable-next-line
    }, [interviews, id]);

    React.useEffect(() => {
        // initial data loading
        if (!isNewInterviewFlow()) {
            loadInterviews();
        }
        loadQuestionBank();
        loadTemplates();

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
        history.push(routeInterviews())
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

        let newInterview = cloneDeep(interview)
        newInterview.structure.groups.push(newGroup)
        setInterview(newInterview)
    }

    const onRemoveGroupClicked = id => {
        let newInterview = cloneDeep(interview)
        newInterview.structure.groups = newInterview.structure.groups.filter(group => group.groupId !== id)
        setInterview(newInterview)
    }

    const onMoveGroupUpClicked = id => {
        let newInterview = cloneDeep(interview)
        let index = newInterview.structure.groups.findIndex(group => group.groupId === id);
        let groups = newInterview.structure.groups;
        [groups[index], groups[index - 1]] = [groups[index - 1], groups[index]];
        setInterview(newInterview)
    }

    const onMoveGroupDownClicked = id => {
        let newInterview = cloneDeep(interview)
        let index = newInterview.structure.groups.findIndex(group => group.groupId === id);
        let groups = newInterview.structure.groups;
        [groups[index], groups[index + 1]] = [groups[index + 1], groups[index]];
        setInterview(newInterview)
    }

    const onAddQuestionClicked = (group) => {
        setSelectedGroup(cloneDeep(group))
        setQuestionsVisible(true)
    }

    const onQuestionsClosed = () => {
        const updatedInterview = cloneDeep(interview)
        updatedInterview.structure.groups
            .find(group => group.groupId === selectedGroup.groupId)
            .questions = cloneDeep(selectedGroup.questions)

        setQuestionsVisible(false)
        setInterview(updatedInterview)
    };

    const onSave = () => {
        if (!interview.guideId) {
            setCreateGuideVisible(true)
        } else {
            saveInterview()
        }
    }

    const saveInterview = () => {
        if (isNewInterviewFlow()) {
            personalEvent('Interview created');
            addInterview(interview);
            message.success(`Interview '${interview.candidate}' created.`);
        } else {
            updateInterview(interview);
            message.success(`Interview '${interview.candidate}' updated.`);
        }
        history.push(routeInterviews());
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
        <Spin spinning={loading}>
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
                onMoveGroupUpClicked={onMoveGroupUpClicked}
                onMoveGroupDownClicked={onMoveGroupDownClicked}
                onGroupNameChanges={onGroupNameChanges}
                onAddQuestionClicked={onAddQuestionClicked}
            />}
            {isSummaryStep() && <TemplateWizardSummary
                interview={interview}
                onSave={onSave}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}

            <Modal
                title="Interview Experience"
                width="80%"
                style={{ top: '5%' }}
                destroyOnClose={true}
                footer={null}
                onCancel={onPreviewClosed}
                visible={previewVisible}>
                <InterviewDetailsCard interview={interview} hideAnchor={true} />
            </Modal>

            <Modal
                width="90%"
                style={{ top: 24 }}
                bodyStyle={{ padding: 0 }}
                destroyOnClose={true}
                closable={false}
                footer={null}
                onCancel={onQuestionsClosed}
                visible={questionsVisible}>
                <TemplateQuestions
                    interview={interview}
                    selectedGroup={selectedGroup}
                    questions={questions}
                    categories={categories}
                    onDoneClicked={onQuestionsClosed}
                />
            </Modal>

            <CreateTemplateModal
                visible={createGuideVisible}
                guides={guides}
                guidesLoading={loading}
                interview={interview}
                onClose={onCloseCreateGuideModal}
            />
        </Spin>
    </Layout>
}

const mapDispatch = { addInterview, loadInterviews, updateInterview, loadQuestionBank, loadTemplates };
const mapState = (state) => {
    const interviewsState = state.interviews || {};
    const guidesState = state.guides || {};
    const questionBankState = state.questionBank || {};

    return {
        interviews: interviewsState.interviews,
        questions: flatMap(questionBankState.categories, (item) => item.questions),
        categories: questionBankState.categories.map(c => c.category.categoryName).sort(),
        guides: guidesState.guides,
        loading: guidesState.loading || questionBankState.loading || interviewsState.loading
    }
}

export default connect(mapState, mapDispatch)(InterviewWizard)
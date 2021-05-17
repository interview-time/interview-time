import styles from "./template-wizard.module.css";
import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { message, Modal, PageHeader, Spin, Steps } from "antd";
import TemplateWizardIntro from "./template-wizard-intro";
import TemplateWizardSummary from "./template-wizard-summary";
import TemplateWizardDetails from "./template-wizard-details";
import TemplateWizardQuestions from "./template-wizard-questions";
import { useHistory, useParams } from "react-router-dom";
import { addTemplate, loadTemplates, updateTemplate } from "../../store/templates/actions";
import { loadQuestionBank } from "../../store/question-bank/actions";
import lang, { cloneDeep } from "lodash/lang";
import TemplateQuestions from "./template-questions";
import {
    findGuide,
    findInterviewGroupQuestions,
    questionsToQuestionIds
} from "../../components/utils/converters";
import { routeTemplates } from "../../components/utils/route";
import { connect } from "react-redux";
import { personalEvent } from "../../analytics";
import { TemplatePreviewCard } from "../interview-scorecard/interview-sections";

const { Step } = Steps;

const STEP_DETAILS = 0
const STEP_INTRO = 1
const STEP_QUESTIONS = 2
const STEP_SUMMARY = 3

/**
 *
 * @param {CategoryHolder[]} categories
 * @param {Template[]} guides
 * @param loading
 * @param loadQuestionBank
 * @param addTemplate
 * @param loadTemplates
 * @param updateTemplate
 * @returns {JSX.Element}
 * @constructor
 */
const TemplateWizard = (
    {
        categories,
        guides,
        loading,
        loadQuestionBank,
        addTemplate,
        loadTemplates,
        updateTemplate
    }) => {

    const emptyGuide = {
        guideId: undefined,
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
    const [guide, setGuide] = useState(emptyGuide);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();

    const history = useHistory();
    const { id } = useParams();

    React.useEffect(() => {
        if (!isNewGuideFlow() && !guide.guideId && guides.length !== 0) {
            setGuide(lang.cloneDeep(findGuide(id, guides)))
        }
        // eslint-disable-next-line
    }, [guides, id]);

    React.useEffect(() => {
        if (!isNewGuideFlow()) {
            loadTemplates()
        }

        loadQuestionBank()
        // eslint-disable-next-line
    }, []);

    const isNewGuideFlow = () => !id;

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
        history.push(routeTemplates())
    }

    const onSave = () => {
        if (isNewGuideFlow()) {
            
            personalEvent('Template created');
            addTemplate(guide);
            message.success(`Template '${guide.title}' created.`);
        } else {
            updateTemplate(guide);
            message.success(`Template '${guide.title}' updated.`);
        }
        history.push(routeTemplates())
    }

    const onPreviewClosed = () => {
        setPreviewVisible(false)
    };

    const onPreviewClicked = () => {
        setPreviewVisible(true)
    }

    const onGroupNameChanges = (groupId, groupName) => {
        guide.structure.groups.find(group => group.groupId === groupId).name = groupName
    };

    const onAddGroupClicked = () => {
        const newGroup = {
            groupId: Date.now().toString(),
            questions: []
        }

        let newGuide = cloneDeep(guide)
        newGuide.structure.groups.push(newGroup)
        setGuide(newGuide)
    }

    const onRemoveGroupClicked = id => {
        let newGuide = cloneDeep(guide)
        newGuide.structure.groups = newGuide.structure.groups.filter(group => group.groupId !== id)
        setGuide(newGuide)
    }

    const onMoveGroupUpClicked = id => {
        let newGuide = cloneDeep(guide)
        let index = newGuide.structure.groups.findIndex(group => group.groupId === id);
        let groups = newGuide.structure.groups;
        [groups[index], groups[index - 1]] = [groups[index - 1], groups[index]];
        setGuide(newGuide)
    }

    const onMoveGroupDownClicked = id => {
        let newGuide = cloneDeep(guide)
        let index = newGuide.structure.groups.findIndex(group => group.groupId === id);
        let groups = newGuide.structure.groups;
        [groups[index], groups[index + 1]] = [groups[index + 1], groups[index]];
        setGuide(newGuide)
    }

    const onAddQuestionClicked = (group) => {
        const selectedGroup = cloneDeep(group)
        selectedGroup.questions = findInterviewGroupQuestions(selectedGroup, categories)

        setSelectedGroup(selectedGroup)
        setQuestionsVisible(true)
    }

    const onQuestionsClosed = () => {
        const updatedGuide = lang.cloneDeep(guide)
        updatedGuide.structure.groups
            .find(group => group.groupId === selectedGroup.groupId)
            .questions = lang.cloneDeep(questionsToQuestionIds(selectedGroup.questions))

        setQuestionsVisible(false)
        setGuide(updatedGuide)
    };

    return <Layout pageHeader={
        <PageHeader
            className={styles.pageHeader}
            title={isNewGuideFlow() ? "New Interview Template" : "Edit Interview Template"}
        >
            <Steps current={step}>
                <Step title="Template Details" />
                <Step title="Intro Section" />
                <Step title="Questions Section" />
                <Step title="Summary Section" />
            </Steps>
        </PageHeader>
    } contentStyle={styles.pageContent}>
        <Spin spinning={loading}>

            {isDetailsStep() && <TemplateWizardDetails
                guide={guide}
                onNext={onNext}
                onDiscard={onDiscard}
                onPreview={onPreviewClicked}
            />}
            {isIntroStep() && <TemplateWizardIntro
                guide={guide}
                onNext={onNext}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}
            {isQuestionsStep() && <TemplateWizardQuestions
                guide={guide}
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
                guide={guide}
                onSave={onSave}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}

            <Modal
                title="Interview Experience"
                width={1000}
                style={{ top: '5%' }}
                destroyOnClose={true}
                footer={null}
                onCancel={onPreviewClosed}
                visible={previewVisible}>
                <TemplatePreviewCard guide={guide} categories={categories} />
            </Modal>

            <Modal
                width="90%"
                style={{ top: 24 }}
                bodyStyle={{ padding: 0}}
                destroyOnClose={true}
                closable={false}
                footer={null}
                onCancel={onQuestionsClosed}
                visible={questionsVisible}>
                <TemplateQuestions
                    guide={guide}
                    selectedGroup={selectedGroup}
                    categories={categories}
                    onDoneClicked={onQuestionsClosed}
                />
            </Modal>
        </Spin>

    </Layout>
}

const mapDispatch = { loadQuestionBank, addTemplate, loadTemplates, updateTemplate };
const mapState = (state) => {
    const guidesState = state.guides || {};
    const questionBankState = state.questionBank || {};

    return {
        categories: questionBankState.categories,
        guides: guidesState.guides,
        loading: guidesState.loading || questionBankState.loading
    }
}

export default connect(mapState, mapDispatch)(TemplateWizard)
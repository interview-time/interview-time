import styles from "./guide-wizard.module.css";
import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { Drawer, message, PageHeader, Spin, Steps } from "antd";
import GuideWizardIntro from "./guide-wizard-intro";
import GuideWizardSummary from "./guide-wizard-summary";
import GuideWizardDetails from "./guide-wizard-details";
import GuideWizardQuestions from "./guide-wizard-questions";
import { useHistory, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addGuide, loadGuides, updateGuide } from "../../store/guides/actions";
import { loadQuestionBank } from "../../store/question-bank/actions";
import lang, { cloneDeep } from "lodash/lang";
import GuideInterviewDetailsCard from "../../components/guide/guide-interview-details-card";
import GuideQuestions from "./guide-questions";
import Collection from "lodash/collection";
import { questionIdsToQuestions, questionsToQuestionIds } from "../../components/utils/converters";

const { Step } = Steps;

const STEP_DETAILS = 0
const STEP_INTRO = 1
const STEP_QUESTIONS = 2
const STEP_SUMMARY = 3

const GuideWizard = () => {

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

    const { guides, guidesLoading } = useSelector(state => ({
        guides: state.guides.guides,
        guidesLoading: state.guides.loading
    }), shallowEqual);

    const { questions, categories, questionsLoading } = useSelector(state => ({
        questions: Collection.sortBy(state.questionBank.questions, ['question']),
        categories: state.questionBank.categories.sort(),
        questionsLoading: state.questionBank.loading
    }), shallowEqual);

    const [step, setStep] = useState(STEP_DETAILS);
    const [guide, setGuide] = useState(emptyGuide);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState();

    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();

    React.useEffect(() => {
        if (!isNewGuideFlow() && !guide.guideId && !guidesLoading) {
            const guide = guides.find(guide => guide.guideId === id);
            if (guide) {
                setGuide(lang.cloneDeep(guide))
            }
        }
        // eslint-disable-next-line
    }, [guides, id]);

    React.useEffect(() => {
        if (!isNewGuideFlow() && guides.length === 0 && !guidesLoading) {
            dispatch(loadGuides())
        }

        if (questions.length === 0 && !questionsLoading) {
            dispatch(loadQuestionBank())
        }
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
        history.push("/guides")
    }

    const onSave = () => {
        if (isNewGuideFlow()) {
            dispatch(addGuide(guide));
            message.success(`Guide '${guide.title}' created.`);
        } else {
            dispatch(updateGuide(guide));
            message.success(`Guide '${guide.title}' updated.`);
        }
        history.push("/guides")
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

    const onAddQuestionClicked = (group) => {
        const selectedGroup = cloneDeep(group)
        selectedGroup.questions = questionIdsToQuestions(selectedGroup.questions, questions)

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
            title={isNewGuideFlow() ? "New Interview Guide" : "Edit Interview Guide"}
        >
            <Steps current={step}>
                <Step title="Guide Details" />
                <Step title="Intro Section" />
                <Step title="Questions Section" />
                <Step title="Summary Section" />
            </Steps>
        </PageHeader>
    }>
        <Spin spinning={guidesLoading || questionsLoading}>

            {isDetailsStep() && <GuideWizardDetails
                guide={guide}
                onNext={onNext}
                onDiscard={onDiscard}
                onPreview={onPreviewClicked}
            />}
            {isIntroStep() && <GuideWizardIntro
                guide={guide}
                onNext={onNext}
                onBack={onBack}
                onPreview={onPreviewClicked}
            />}
            {isQuestionsStep() && <GuideWizardQuestions
                guide={guide}
                onNext={onNext}
                onBack={onBack}
                onPreview={onPreviewClicked}
                onAddGroupClicked={onAddGroupClicked}
                onRemoveGroupClicked={onRemoveGroupClicked}
                onGroupNameChanges={onGroupNameChanges}
                onAddQuestionClicked={onAddQuestionClicked}
            />}
            {isSummaryStep() && <GuideWizardSummary
                guide={guide}
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
                <GuideInterviewDetailsCard guide={guide} />
            </Drawer>

            <Drawer
                title="Add Questions"
                width="90%"
                closable={true}
                destroyOnClose={true}
                onClose={onQuestionsClosed}
                placement='right'
                visible={questionsVisible}>
                <GuideQuestions
                    guide={guide}
                    selectedGroup={selectedGroup}
                    questions={questions}
                    categories={categories}
                />
            </Drawer>
        </Spin>

    </Layout>
}

export default GuideWizard
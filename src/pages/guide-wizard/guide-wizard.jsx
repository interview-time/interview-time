import styles from "./guide-wizard.module.css";
import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { message, PageHeader, Steps } from "antd";
import GuideWizardIntro from "./guide-wizard-intro";
import GuideWizardSummary from "./guide-wizard-summary";
import GuideWizardDetails from "./guide-wizard-details";
import GuideWizardQuestions from "./guide-wizard-questions";
import { useHistory, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addGuide, loadGuides, updateGuide } from "../../store/guides/actions";
import lang from "lodash/lang";

const { Step } = Steps;

const STEP_DETAILS = 0
const STEP_INTRO = 1
const STEP_QUESTIONS = 2
const STEP_SUMMARY = 3

const GuideWizard = () => {

    const emptyGuide = {
        guideId: undefined,
        structure: {
            groups: []
        }
    }

    const { guides, guidesLoading } = useSelector(state => ({
        guides: state.guides.guides,
        guidesLoading: state.guides.loading
    }), shallowEqual);

    const [step, setStep] = useState(STEP_DETAILS);
    const [guide, setGuide] = useState(emptyGuide);

    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();

    // const detailsPage = React.createRef();

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
        // eslint-disable-next-line
    }, []);

    const validation = () => ({
        isDetailsDataValid: null,
        isIntroDataValid: null,
    })

    const isNewGuideFlow = () => !id;

    const isDetailsStep = () => step === STEP_DETAILS;

    const isIntroStep = () => step === STEP_INTRO;

    const isQuestionsStep = () => step === STEP_QUESTIONS;

    const isSummaryStep=  () => step === STEP_SUMMARY;

    const onStepClicked = (current) => {
        if(isDetailsStep() && !validation.isDetailsDataValid()) {
            console.log('Details data is not valid.')
            return
        }

        setStep(current)
        // console.log(detailsPage)
        // console.log(detailsPage.current)
    }

    const onDetailsNext = (title, category, description) => {
        console.log(`title: ${title} category: ${category} description: ${description}`)
        guide.title = title;
        guide.type = category;
        guide.description = description;
        setStep(STEP_INTRO)
    }

    const onNext = () => {
        setStep(step + 1)
    }

    const onBack = () => {
        setStep(step - 1)
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

    return <Layout pageHeader={
        <PageHeader
            className={styles.pageHeader}
            title={isNewGuideFlow() ? "New Interview Guide" : "Edit Interview Guide"}
        >
            <Steps current={step} onChange={onStepClicked}>
                <Step title="Interview Details" />
                <Step title="Intro Section" />
                <Step title="Questions Section" />
                <Step title="Summary Section" />
            </Steps>
        </PageHeader>
    }>

        {isDetailsStep() && <GuideWizardDetails
            guide={guide}
            onNext={onDetailsNext}
            onBack={onBack}
            validation={validation}
        />}
        {isIntroStep() && <GuideWizardIntro onNext={onNext} onBack={onBack} />}
        {isQuestionsStep() && <GuideWizardQuestions onNext={onNext} onBack={onBack} />}
        {isSummaryStep() && <GuideWizardSummary onSave={onSave} onBack={onBack} />}

    </Layout>
}

export default GuideWizard
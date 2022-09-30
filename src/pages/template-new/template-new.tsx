import HeaderBase from "../../components/header/header-base";
import { createCloseBackButton } from "../../components/header/header-utils";
import { connect } from "react-redux";
import {
    addTemplate,
    loadLibrary,
    loadSharedTemplate,
    loadTemplates,
    updateTemplate,
} from "../../store/templates/actions";

import { RootState } from "../../store/state-models";
import { InterviewType, Template } from "../../store/models";
import React, { useEffect, useReducer, useState } from "react";
import styles from "./template-new.module.css";
import { useHistory, useLocation } from "react-router-dom";
import { Button, message, Steps } from "antd";
import Text from "antd/lib/typography/Text";
import TemplateStepType from "./step-type/template-step-type";
import StepDetailsInterview from "./step-details/type-interview/step-details-interview";
import { cloneDeep, isEmpty } from "lodash";
import { selectTemplate } from "../../store/templates/selector";
import { interviewToTags } from "../../utils/converters";
import { personalEvent } from "../../analytics";
import { routeTemplates } from "../../utils/route";
import StepDetailsLiveCoding from "./step-details/type-live-coding/step-details-live-coding";
import { ReducerAction, ReducerActionType, templateReducer } from "./template-reducer";
import Spinner from "../../components/spinner/spinner";
import { cloneLibraryTemplate, cloneSharedTemplate, emptyTemplate, newTemplateFromType } from "./template-utils";
import TemplateStepPreview from "./step-preview/template-step-preview";
import { v4 as uuidv4 } from "uuid";

const { Step } = Steps;

type Flow = {
    existingTemplateId: string | null;
    libraryTemplateId: string | null;
    sharedTemplateToken: string | null;
    blankTemplate: boolean;
};

type Props = {
    flow: Flow;
    originalTemplate: Template | undefined;
    allQuestionTags: string[];
    teamId: string;
    loadTemplates: Function;
    loadLibrary: Function;
    loadSharedTemplate: Function;
    addTemplate: Function;
    updateTemplate: Function;
};

const TemplateNew = ({
    flow,
    originalTemplate,
    allQuestionTags,
    teamId,
    loadTemplates,
    loadLibrary,
    loadSharedTemplate,
    addTemplate,
    updateTemplate,
}: Props) => {
    const STEP_TYPE = 0;
    const STEP_DETAILS = 1;
    const STEP_PREVIEW = 2;
    const PARAM_STEP = "step";

    const history = useHistory();
    const location = useLocation();

    const getStepFromURL = () => {
        const step = new URLSearchParams(location.search).get(PARAM_STEP);
        return step ? parseInt(step) : undefined;
    };

    const setStepURL = (step: number) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(PARAM_STEP, step.toString());
        history.replace({ pathname: location.pathname, search: searchParams.toString() });
    };

    const [step, setStep] = useState<number>();
    const [template, dispatch] = useReducer(templateReducer, emptyTemplate(""));

    useEffect(() => {
        const stepFromURL = getStepFromURL();
        if (flow.existingTemplateId) {
            loadTemplates();
            setStep(stepFromURL ?? STEP_DETAILS);
        } else if (flow.libraryTemplateId) {
            loadLibrary();
            setStep(stepFromURL ?? STEP_DETAILS);
        } else if (flow.sharedTemplateToken) {
            loadSharedTemplate(flow.sharedTemplateToken);
            setStep(stepFromURL ?? STEP_DETAILS);
        } else {
            setStep(STEP_TYPE);
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        console.log("originalTemplate", originalTemplate);
        console.log("template", template);
        if (originalTemplate && isEmpty(template.templateId)) {
            dispatch({
                type: ReducerActionType.SET_TEMPLATE,
                template: originalTemplate,
            });
        }
        // eslint-disable-next-line
    }, [originalTemplate]);

    useEffect(() => {
        if (step !== undefined) {
            setStepURL(step);
        }
        // eslint-disable-next-line
    }, [step]);

    const onStepChange = (value: number) => {
        setStep(value);
    };

    const onNextClicked = () => {
        if (step !== undefined) {
            if (step === STEP_PREVIEW) {
                if (flow.existingTemplateId) {
                    updateTemplate(template);
                    message.success(`Template '${template.title}' updated.`);
                } else {
                    personalEvent("Template created");
                    addTemplate(template);
                    message.success(`Template '${template.title}' created.`);
                }
                history.push(routeTemplates());
            } else {
                setStep(step + 1);
            }
        }
    };

    const onTemplateChange = (action: ReducerAction) => {
        dispatch(action);
    };

    const onInterviewTypeChange = (type: InterviewType) => {
        if (type !== template.interviewType) {
            const newTemplate = newTemplateFromType(template, type);
            if (newTemplate) {
                dispatch({
                    type: ReducerActionType.SET_TEMPLATE,
                    template: newTemplate,
                });
            }
        }
    };

    const createStepTitle = (index: number, text: string) => (
        <Text className={step === index ? styles.stepLabelActive : styles.stepLabel}>{text}</Text>
    );

    const createStepDescription = (text: string) => <Text className={styles.stepDescription}>{text}</Text>;

    if (isEmpty(template.templateId)) {
        return <Spinner />;
    }

    return (
        <div className={styles.rootContainer}>
            <HeaderBase
                leftComponent={createCloseBackButton(history)}
                rightComponent={
                    <Button type='primary' onClick={onNextClicked}>
                        {step === STEP_PREVIEW ? "Finish" : "Next"}
                    </Button>
                }
                centerComponent={
                    /* @ts-ignore */
                    <Steps current={step} onChange={onStepChange}>
                        <Step
                            title={createStepTitle(STEP_TYPE, "STEP 1")}
                            description={createStepDescription("Type")}
                        />
                        <Step
                            title={createStepTitle(STEP_DETAILS, "STEP 2")}
                            description={createStepDescription("Details")}
                        />
                        <Step
                            title={createStepTitle(STEP_PREVIEW, "STEP 3")}
                            description={createStepDescription("Preview")}
                        />
                    </Steps>
                }
            />
            {step === STEP_TYPE && (
                <TemplateStepType
                    interviewType={template.interviewType}
                    onInterviewTypeChange={onInterviewTypeChange}
                />
            )}
            {step === STEP_DETAILS && template.interviewType === InterviewType.INTERVIEW && (
                <StepDetailsInterview
                    template={template}
                    onTemplateChange={onTemplateChange}
                    allQuestionTags={allQuestionTags}
                />
            )}

            {step === STEP_DETAILS && template.interviewType === InterviewType.LIVE_CODING && (
                <StepDetailsLiveCoding template={template} teamId={teamId} onTemplateChange={onTemplateChange} />
            )}

            {step === STEP_PREVIEW && (
                <TemplateStepPreview template={template} onTemplateChange={onTemplateChange} />
            )}
        </div>
    );
};

const mapDispatch = {
    addTemplate,
    loadTemplates,
    loadLibrary,
    updateTemplate,
    loadSharedTemplate,
};

const mapState = (state: RootState, ownProps: any) => {
    let searchParams = new URLSearchParams(ownProps.location.search);
    let flow: Flow = {
        existingTemplateId: ownProps.match.params.id,
        libraryTemplateId: searchParams.get("fromLibrary"),
        sharedTemplateToken: searchParams.get("sharedTemplateToken"),
        blankTemplate: false,
    };

    let template: Template | undefined;
    let allQuestionTags: string[] = [];
    if (flow.existingTemplateId) {
        let existingTemplate = selectTemplate(state.templates, flow.existingTemplateId);
        if (existingTemplate) {
            template = cloneDeep(existingTemplate);
            allQuestionTags = interviewToTags(template);
        }
    } else if (flow.libraryTemplateId) {
        let clonedLibraryTemplate = cloneLibraryTemplate(state.templates.library, flow.libraryTemplateId);
        if (clonedLibraryTemplate) {
            // @ts-ignore
            template = clonedLibraryTemplate;
            allQuestionTags = interviewToTags(clonedLibraryTemplate);
        }
    } else if (flow.sharedTemplateToken) {
        let sharedTemplate = state.templates.sharedTemplate;
        if (sharedTemplate) {
            template = cloneSharedTemplate(sharedTemplate);
            allQuestionTags = interviewToTags(template);
        }
    } else {
        template = emptyTemplate(uuidv4());
        flow.blankTemplate = true;
    }

    if (template && !template.interviewType) {
        template.interviewType = InterviewType.INTERVIEW;
    }

    return {
        flow: flow,
        originalTemplate: template,
        allQuestionTags: allQuestionTags,
        teamId: state.user.profile.currentTeamId,
    };
};

export default connect(mapState, mapDispatch)(TemplateNew);

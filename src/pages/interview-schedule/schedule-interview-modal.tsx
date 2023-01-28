import { Button, Checkbox, message, Modal, Select, Space, Spin, Tooltip } from "antd";
import { addHours, parse, roundToNearestMinutes, set } from "date-fns";
import { isEmpty } from "lodash";
import React, { useEffect, useReducer } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CompleteImage from "../../assets/illustrations/undraw_completing.svg";
import SelectionImage from "../../assets/illustrations/undraw_selection.svg";
import WarningImage from "../../assets/illustrations/undraw_warning.svg";
import { Colors } from "../../assets/styles/colors";
import {
    CardOutlined,
    ErrorLabelSmall,
    FormLabel,
    SecondaryText,
    TextBold,
    TextBoldSmall,
    TextExtraBold,
    TextSmall,
} from "../../assets/styles/global-styles";
import DatePicker from "../../components/antd/DatePicker";
import InterviewTypeTag from "../../components/tags/interview-type-tag";
import { fetchCandidateDetails, loadCandidates } from "../../store/candidates/actions";
import {
    CandidateStatus,
    filterCandidates,
    selectCandidateDetails,
    selectCandidates,
    selectGetCandidateDetailsStatus,
    sortCandidatesByCreatedDate,
} from "../../store/candidates/selector";
import { addInterview, NewInterview } from "../../store/interviews/actions";
import { selectAddInterviewStatus, selectUpdateInterviewStatus } from "../../store/interviews/selector";
import {
    Candidate,
    CandidateDetails,
    CandidateStageStatus,
    CurrentStage,
    InterviewStatus,
    InterviewType,
    TeamMember,
    Template,
    UserProfile,
} from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { loadTeam } from "../../store/team/actions";
import { selectTeamMembers } from "../../store/team/selector";
import { loadTemplates } from "../../store/templates/actions";
import { selectTemplates } from "../../store/templates/selector";
import { selectUserProfile } from "../../store/user/selector";
import {
    datePickerFormat,
    formatDate,
    formatDateISO,
    generateTimeSlots,
    parseDateISO,
    timePickerFormat,
} from "../../utils/date-fns";
import { filterOptionLabel } from "../../utils/filters";

const { Option } = Select;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 32px;
`;

const JobContent = styled.div`
    display: flex;
    flex-direction: column;
    background: ${Colors.Neutral_50};
    margin-top: 24px;
    border-radius: 8px;
    padding: 16px;
    min-height: 240px;
`;

const PlaceholderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    margin: 24px;
`;

const Label = styled(FormLabel)`
    margin-bottom: 8px;
    margin-top: 24px;
`;

const LabelTop = styled(FormLabel)`
    margin-bottom: 12px;
`;

const JobTitle = styled(TextExtraBold)`
    margin-bottom: 12px;
`;

const ErrorLabel = styled(ErrorLabelSmall)`
    margin-top: 8px;
`;

type StageColorBoxProps = {
    color: string;
};

const StageCard = styled(CardOutlined)`
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    border-color: ${Colors.Neutral_200};
`;

const StageColorBox = styled.div`
    width: 20px;
    height: 20px;
    background: ${(props: StageColorBoxProps) => props.color};
    border-radius: 6px;
`;

const DateContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const InterviewDatePicker = styled(DatePicker)`
    flex: 1;
`;

const SendChallengeContainer = styled.div`
    display: flex;
    margin-top: 8px;
    gap: 8px;
    flex-direction: column;
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
`;

interface FormData {
    startDate: string;
    endDate: string;
    candidateId?: string;
    template?: Template;
    interviewersIds: string[];
    sendChallenge: boolean;
}

type Props = {
    open: boolean;
    alwaysFetchCandidate?: boolean;
    candidateId?: string;
    onClose: (interviewChanged?: boolean) => void;
};

const ScheduleInterviewModal = ({ open, alwaysFetchCandidate, candidateId, onClose }: Props) => {
    const dispatch = useDispatch();
    const defaultStartDateTime = formatDateISO(roundToNearestMinutes(new Date(), { nearestTo: 15 }));
    const defaultEndDateTime = formatDateISO(roundToNearestMinutes(addHours(new Date(), 1), { nearestTo: 15 }));

    const initialFormData: FormData = {
        candidateId: undefined,
        startDate: defaultStartDateTime,
        endDate: defaultEndDateTime,
        interviewersIds: [],
        sendChallenge: false,
    };
    const [formData, updateFormData] = useReducer((state: FormData, newState: Partial<FormData>) => {
        return { ...state, ...newState };
    }, initialFormData);

    const profile: UserProfile = useSelector(selectUserProfile, shallowEqual);
    const teamMembers: TeamMember[] = useSelector(selectTeamMembers, shallowEqual);
    const templates: Template[] = useSelector(selectTemplates, shallowEqual);
    const candidates: Candidate[] = useSelector(selectCandidates, shallowEqual);
    const selectedCandidate: CandidateDetails | undefined = useSelector(
        selectCandidateDetails(formData.candidateId),
        shallowEqual
    );

    const addInterviewStatus = useSelector(selectAddInterviewStatus, shallowEqual);
    const updateInterviewStatus = useSelector(selectUpdateInterviewStatus, shallowEqual);
    const getCandidateDetailsStatus = useSelector(selectGetCandidateDetailsStatus, shallowEqual);
    const candidateDetailsLoading = getCandidateDetailsStatus === ApiRequestStatus.InProgress;

    const isScheduleButtonEnabled =
        formData.candidateId && formData.template?.templateId && formData.interviewersIds.length > 0;
    const isExistingCandidate = !isEmpty(candidateId);
    const isTakeHomeChallenge = (template: Template | undefined) =>
        template?.interviewType === InterviewType.TAKE_HOME_TASK;
    const isInterviewWithoutDate = isTakeHomeChallenge(formData.template);
    const isInterviewScheduled = selectedCandidate?.currentStage?.status === CandidateStageStatus.INTERVIEW_SCHEDULED;

    const candidatesOptions = sortCandidatesByCreatedDate(filterCandidates(candidates, CandidateStatus.Current))
        .sort((a, b) => a.candidateName.localeCompare(b.candidateName))
        .map(candidate => ({
            value: candidate.candidateId,
            label: candidate.candidateName,
        }));
    const templateOptions = templates
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(template => (
            <Option key={template.templateId} value={template.templateId} label={template.title}>
                <div>
                    {template.title}
                    <InterviewTypeTag interviewType={template.interviewType} />
                </div>
            </Option>
        ));

    const interviewersOptions = teamMembers
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(member =>
            member.userId === profile.userId
                ? {
                      label: `${member.name} (you)`,
                      value: member.userId,
                  }
                : {
                      label: member.name,
                      value: member.userId,
                  }
        );

    useEffect(() => {
        if (profile.currentTeamId && teamMembers.length === 0) {
            dispatch(loadTeam(profile.currentTeamId));
        }
        if (templates.length === 0) {
            dispatch(loadTemplates());
        }
        if (candidates.length === 0) {
            dispatch(loadCandidates());
        }
        // eslint-disable-next-line
    }, [profile]);

    useEffect(() => {
        if (open && candidateId) {
            updateFormData({
                candidateId: candidateId,
            });
        }

        // eslint-disable-next-line
    }, [open]);

    useEffect(() => {
        if (formData.candidateId && (!selectedCandidate || alwaysFetchCandidate)) {
            dispatch(fetchCandidateDetails(formData.candidateId));
        }
        // eslint-disable-next-line
    }, [formData.candidateId]);

    useEffect(() => {
        if (selectedCandidate) {
            let template = findTemplate(selectedCandidate?.currentStage?.templateId);
            updateFormData({
                template: template,
                sendChallenge: isTakeHomeChallenge(template),
            });
        }
        // eslint-disable-next-line
    }, [selectedCandidate]);

    useEffect(() => {
        if (addInterviewStatus === ApiRequestStatus.Success) {
            // noinspection JSIgnoredPromiseFromCall
            message.success("Interview successfully scheduled");
            onClose(true);
        } else if (updateInterviewStatus === ApiRequestStatus.Success) {
            // noinspection JSIgnoredPromiseFromCall
            message.success("Interview successfully updated");
            onClose(true);
        }
        // eslint-disable-next-line
    }, [addInterviewStatus, updateInterviewStatus]);

    const onAfterClose = () => {
        updateFormData(initialFormData);
    };

    const findTemplate = (templateId: string | undefined) =>
        templates.find(template => template.templateId === templateId);

    const onScheduleClicked = () => {
        let selectedTemplate = formData.template;
        if (!selectedCandidate || !selectedTemplate) {
            return;
        }

        let interview: NewInterview = {
            interviewers: formData.interviewersIds,
            interviewDateTime: formData.startDate,
            interviewEndDateTime: formData.endDate,
            teamId: profile.currentTeamId,
            candidateId: selectedCandidate.candidateId,
            candidate: selectedCandidate.candidateName,
            sendChallenge: formData.sendChallenge,
            status: InterviewStatus.NEW,
            templateIds: [selectedTemplate.templateId],
            interviewType: selectedTemplate.interviewType,
            structure: selectedTemplate.structure,
            checklist: selectedTemplate.checklist,
        };

        if (selectedTemplate.interviewType === InterviewType.LIVE_CODING) {
            interview.liveCodingChallenges = selectedTemplate.challenges;
        } else if (selectedTemplate.interviewType === InterviewType.TAKE_HOME_TASK) {
            interview.takeHomeChallenge = selectedTemplate.challenges![0];
        }

        dispatch(addInterview(interview));
    };

    const onDateChange = (newDate: Date | null) => {
        if (!newDate) {
            return;
        }

        updateFormData({
            startDate: formatDateISO(
                set(parseDateISO(formData.startDate)!, {
                    year: newDate.getFullYear(),
                    month: newDate.getMonth(),
                    date: newDate.getDate(),
                })
            ),
            endDate: formatDateISO(
                set(parseDateISO(formData.endDate)!, {
                    year: newDate.getFullYear(),
                    month: newDate.getMonth(),
                    date: newDate.getDate(),
                })
            ),
        });
    };

    const onStartTimeChange = (value: string) => {
        let selectedStartDateParsed: Date = parseDateISO(formData.startDate)!;
        let selectedStartDateNew: Date = parse(value, "HH:mm", selectedStartDateParsed);

        if (selectedStartDateNew > parseDateISO(formData.endDate)!) {
            updateFormData({
                startDate: formatDateISO(selectedStartDateNew),
                endDate: formatDateISO(addHours(selectedStartDateNew, 1)),
            });
        } else {
            updateFormData({
                startDate: formatDateISO(selectedStartDateNew),
            });
        }
    };

    const onEndTimeChange = (value: string) => {
        let selectedStartDateParsed = parseDateISO(formData.endDate)!;
        let selectedEndDateNew = parse(value, "HH:mm", selectedStartDateParsed);

        if (selectedStartDateParsed > selectedEndDateNew) {
            updateFormData({
                startDate: formatDateISO(addHours(selectedEndDateNew, -1)),
                endDate: formatDateISO(selectedEndDateNew),
            });
        } else {
            updateFormData({
                endDate: formatDateISO(selectedEndDateNew),
            });
        }
    };

    const getSendAssignmentFormItem = () => {
        const emailAvailable = !isEmpty(selectedCandidate?.email);
        const checkbox = (
            <Checkbox
                checked={formData.sendChallenge}
                disabled={!emailAvailable}
                onChange={e =>
                    updateFormData({
                        sendChallenge: e.target.checked,
                    })
                }
            >
                Send assignment via email now
            </Checkbox>
        );

        return (
            <SendChallengeContainer>
                {emailAvailable ? (
                    checkbox
                ) : (
                    <Tooltip title='Candidate email is not available'>
                        {/*span is required to show Tooltip for disabled button*/}
                        <span>{checkbox}</span>
                    </Tooltip>
                )}
                {formData.sendChallenge && (
                    <span>
                        <TextSmall>Take-home assignment will be sent to </TextSmall>
                        <TextBoldSmall>{selectedCandidate?.email}</TextBoldSmall>
                    </span>
                )}
            </SendChallengeContainer>
        );
    };

    const getInterviewForm = (stage: CurrentStage, template: Template) => (
        <>
            <Label>Interview Template</Label>
            <Select
                showSearch
                allowClear={false}
                placeholder='Select interview template'
                value={template.templateId}
                onChange={value =>
                    updateFormData({
                        template: findTemplate(value),
                    })
                }
                filterOption={filterOptionLabel}
            >
                {templateOptions}
            </Select>
            {isTakeHomeChallenge(formData.template) && getSendAssignmentFormItem()}
            {stage.templateId !== template.templateId && (
                <ErrorLabel>
                    Note: selected template doesn't match with a template defined in this job stage.
                </ErrorLabel>
            )}
            <Label>Interviewers</Label>
            <Select
                mode='multiple'
                placeholder='Select one or more interviewers'
                value={formData.interviewersIds}
                options={interviewersOptions}
                filterOption={filterOptionLabel}
                onChange={values =>
                    updateFormData({
                        interviewersIds: values,
                    })
                }
            />
            {!isInterviewWithoutDate && (
                <>
                    <Label>Interview Date</Label>
                    <DateContainer>
                        <InterviewDatePicker
                            allowClear={false}
                            format={datePickerFormat()}
                            value={parseDateISO(formData.startDate)}
                            onSelect={onDateChange}
                        />
                        <Select
                            allowClear={false}
                            showSearch
                            placeholder='Start time'
                            options={generateTimeSlots()}
                            value={formatDate(formData.startDate, timePickerFormat())}
                            onSelect={onStartTimeChange}
                        />
                        <Select
                            allowClear={false}
                            showSearch
                            placeholder='End time'
                            options={generateTimeSlots()}
                            value={formatDate(formData.endDate, timePickerFormat())}
                            onSelect={onEndTimeChange}
                        />
                    </DateContainer>
                </>
            )}
        </>
    );

    const getJobForm = (stage: CurrentStage) => {
        if (!stage.templateId) {
            return (
                <PlaceholderContainer>
                    <img src={WarningImage} height={138} alt='Warning' />
                    <SecondaryText>This job stage is not linked to an interview template.</SecondaryText>
                </PlaceholderContainer>
            );
        }

        if (isInterviewScheduled) {
            return (
                <PlaceholderContainer>
                    <img src={CompleteImage} height={138} alt='Warning' />
                    <SecondaryText>Interview for this stage is already scheduled.</SecondaryText>
                </PlaceholderContainer>
            );
        } else if (formData.template) {
            return getInterviewForm(stage, formData.template);
        }
    };

    const getJobContent = () => {
        if (!formData.candidateId) {
            return (
                <PlaceholderContainer>
                    <img src={SelectionImage} height={138} alt='Selection' />
                    <SecondaryText>Select candidate to get started.</SecondaryText>
                </PlaceholderContainer>
            );
        } else if (selectedCandidate && !selectedCandidate.jobId) {
            return (
                <PlaceholderContainer>
                    <img src={WarningImage} height={138} alt='Warning' />
                    <SecondaryText>This candidate is not linked to any job.</SecondaryText>
                </PlaceholderContainer>
            );
        } else if (selectedCandidate && selectedCandidate.jobId) {
            return (
                <>
                    <JobTitle>{selectedCandidate.jobTitle}</JobTitle>
                    {selectedCandidate.currentStage && (
                        <>
                            <StageCard>
                                <StageColorBox color={selectedCandidate.currentStage.colour} />
                                <TextBold>{selectedCandidate.currentStage.title}</TextBold>
                            </StageCard>
                            {getJobForm(selectedCandidate.currentStage)}
                        </>
                    )}
                </>
            );
        }
    };

    return (
        <Modal
            title='Schedule Interview'
            open={open}
            afterClose={onAfterClose}
            onCancel={() => onClose(false)}
            footer={null}
        >
            <SecondaryText>Enter interview details.</SecondaryText>

            <Content>
                <LabelTop>Candidate</LabelTop>
                <Select
                    showSearch
                    allowClear
                    placeholder='Select candidate'
                    disabled={isExistingCandidate}
                    value={selectedCandidate?.candidateId}
                    onChange={value =>
                        updateFormData({
                            candidateId: value,
                        })
                    }
                    options={candidatesOptions}
                    filterOption={filterOptionLabel}
                />
                <Spin spinning={candidateDetailsLoading}>
                    <JobContent>{getJobContent()}</JobContent>
                </Spin>
            </Content>
            <Footer>
                {/* We may want to add remove button here in future*/}
                <div />
                <Space>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button
                        type='primary'
                        disabled={!isScheduleButtonEnabled}
                        loading={addInterviewStatus === ApiRequestStatus.InProgress}
                        onClick={onScheduleClicked}
                    >
                        Schedule
                    </Button>
                </Space>
            </Footer>
        </Modal>
    );
};

export default ScheduleInterviewModal;

import React, { useState } from "react";
import { Button, Col, Select, Space } from "antd";
import {
    CandidateInfoSection,
    InterviewGroupsSection,
    InterviewInfoSection,
    IntroSection,
    SummarySection,
} from "./interview-sections";
import NotesSection from "./notes-section";
import TimeAgo from "../../components/time-ago/time-ago";
import Header from "../../components/header/header";
import styles from "./interview-scorecard.module.css";
import { BackIcon, CloseIcon } from "../../components/utils/icons";
import { useHistory } from "react-router-dom";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import Card from "../../components/card/card";
import Text from "antd/lib/typography/Text";
import { PlusOutlined } from "@ant-design/icons";
import { routeHome } from "../../components/utils/route";

/**
 *
 * @param {Interview} interview
 * @param {TeamMember[]} teamMembers
 * @param {Template[]} templates
 * @param {Candidate} candidate
 * @param onCompletedClicked
 * @param onQuestionNotesChanged
 * @param onQuestionAssessmentChanged
 * @param onNoteChanges
 * @param onQuestionsAdded
 * @param onQuestionsRemoved
 * @param {boolean} interviewsUploading
 * @returns {JSX.Element}
 * @constructor
 */
const Assessment = ({
    interview,
    teamMembers,
    templates,
    candidate,
    onCompletedClicked,
    onQuestionNotesChanged,
    onQuestionAssessmentChanged,
    onNoteChanges,
    onQuestionsAdded,
    onQuestionsRemoved,
    interviewsUploading,
}) => {
    const history = useHistory();
    const [templateOptions, setTemplateOptions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(/** @type {Template|undefined} */ undefined);

    React.useEffect(() => {
        // templates selector
        if (templates.length !== 0 && templateOptions.length === 0) {
            setTemplateOptions(
                templates.map(template => ({
                    value: template.templateId,
                    label: template.title,
                }))
            );
        }
        // eslint-disable-next-line
    }, [templates]);

    const onTemplateSelect = value => {
        let template = templates.find(template => template.templateId === value);
        setSelectedTemplate(template);
    };

    const onAddQuestions = () => {
        if (selectedTemplate) {
            onQuestionsAdded(selectedTemplate);
        }
    };

    return (
        <div className={styles.rootContainer}>
            <Header
                title={interview.candidate}
                subtitle={interview.position}
                leftComponent={
                    <Space size={16}>
                        {history.action !== "POP" ? (
                            <Button icon={<BackIcon />} size='large' onClick={() => history.goBack()} />
                        ) : (
                            <Button icon={<CloseIcon />} size='large' onClick={() => history.replace(routeHome())} />
                        )}

                        <TimeAgo timestamp={interview.modifiedDate} saving={interviewsUploading} />
                    </Space>
                }
                rightComponent={
                    <Space size={16}>
                        <InterviewStatusTag interview={interview} />
                        <Button type='primary' onClick={onCompletedClicked}>
                            Complete Interview
                        </Button>
                    </Space>
                }
            />

            <Col span={22} offset={1} xl={{ span: 20, offset: 2 }} xxl={{ span: 16, offset: 4 }} className={styles.interviewSectionContainer}>
                <div className={styles.divSpaceBetween} style={{ marginTop: 32 }}>
                    <InterviewInfoSection interview={interview} teamMembers={teamMembers} />
                    <CandidateInfoSection candidate={candidate} />
                </div>

                <Card style={{ marginTop: 32 }}>
                    <IntroSection interview={interview} hashStyle={styles.hash} />
                </Card>

                <InterviewGroupsSection
                    interview={interview}
                    onQuestionNotesChanged={onQuestionNotesChanged}
                    onQuestionAssessmentChanged={onQuestionAssessmentChanged}
                    onRemoveGroupClicked={onQuestionsRemoved}
                    hashStyle={styles.hash}
                />

                <Card style={{ marginTop: 32, padding: 16 }}>
                    <div className={styles.divSpaceBetween}>
                        <Text type='secondary'>Need more questions? Import questions from your templates.</Text>
                        <Space>
                            <Select
                                style={{ width: "200px" }}
                                showSearch
                                allowClear
                                placeholder='Select template'
                                onChange={onTemplateSelect}
                                options={templateOptions}
                            />

                            <Button icon={<PlusOutlined />} disabled={!selectedTemplate} onClick={onAddQuestions}>
                                Import questions
                            </Button>
                        </Space>
                    </div>
                </Card>

                <Card style={{ marginTop: 32 }}>
                    <SummarySection interview={interview} />
                </Card>
            </Col>

            <NotesSection notes={interview.notes} status={interview.status} onChange={onNoteChanges} />
        </div>
    );
};

export default Assessment;

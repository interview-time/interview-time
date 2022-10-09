import styles from "./candidate-details.module.css";
import { Button, Col, Divider, Row, Select } from "antd";
import React from "react";
import InterviewsTable from "../interviews/interviews-table";
import Title from "antd/lib/typography/Title";
import Card from "../../components/card/card";
import Text from "antd/lib/typography/Text";
import { CandidateStatus } from "../../utils/constants";
import CandidateStatusTag from "../../components/tags/candidate-status-tag";
import { Option } from "antd/lib/mentions";
import { AlertIcon, ProfileIcon } from "../../utils/icons";
import Avatar from "antd/es/avatar/avatar";
import { CandidateInfo as CandidateInfoSection } from "../../components/scorecard/candidate-info";

/**
 *
 * @param {UserProfile} profile
 * @param {string} userRole
 * @param {Candidate} candidate
 * @param {Interview[]} interviews
 * @param onUpdateStatus
 * @param onDeleteInterview
 * @param onUndoArchive
 * @returns {JSX.Element}
 * @constructor
 */
const CandidateInfo = ({ profile, userRole, candidate, interviews, onUpdateStatus, onDeleteInterview, onUndoArchive }) => {
    const candidateInfo = () => candidate.linkedIn || candidate.gitHub || candidate.resumeUrl;

    const statusTag = ({ value }) => <CandidateStatusTag status={value} />;

    const createOption = status => (
        <Option value={status}>
            <CandidateStatusTag status={status} />
        </Option>
    );

    return (
        <div className={styles.candidateInfoContainer}>
            {candidate.archived && (
                <div className={styles.archiveBackground}>
                    <span className={styles.archiveTextContainer}>
                        <AlertIcon style={{ marginRight: 4 }} />
                        <Text className={styles.archiveTextDark}>This candidate is marked as archived.</Text>{" "}
                        <Text className={styles.archiveTextLight}>
                            Such candidates are only visible on the candidates' page.
                        </Text>
                    </span>
                    <Button onClick={onUndoArchive}>Undo Archive</Button>
                </div>
            )}

            <Row gutter={32} style={{ marginTop: 24 }}>
                <Col xl={8} lg={12} span={24}>
                    <Card>
                        <div className={styles.divSpaceBetween}>
                            <div>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    {candidate.candidateName}
                                </Title>
                                {candidate.email && (
                                    <Text type='secondary' className={styles.label}>
                                        {candidate.email}
                                    </Text>
                                )}
                                {candidate.position && (
                                    <Text type='secondary' className={styles.label}>
                                        {candidate.position}
                                    </Text>
                                )}
                            </div>
                            <Avatar src={null} className={styles.avatar} size={48} icon={<ProfileIcon />} />
                        </div>
                        <Divider className={styles.divider} />

                        <Select
                            showArrow
                            defaultValue={candidate.status}
                            style={{ width: 160 }}
                            tagRender={statusTag}
                            onChange={value => onUpdateStatus(value)}
                        >
                            {createOption(CandidateStatus.NEW)}
                            {createOption(CandidateStatus.INTERVIEWING)}
                            {createOption(CandidateStatus.HIRE)}
                            {createOption(CandidateStatus.NO_HIRE)}
                        </Select>
                    </Card>
                </Col>
                {candidateInfo() && (
                    <Col xl={8} lg={12} span={24}>
                        <Card>
                            <CandidateInfoSection candidate={candidate} />
                        </Card>
                    </Col>
                )}
            </Row>

            <Title level={5} style={{ marginBottom: 12, marginTop: 32 }}>
                Interviews
            </Title>
            <InterviewsTable
                interviews={interviews}
                profile={profile}
                userRole={userRole}
                deleteInterview={onDeleteInterview}
                showFilter={false}
            />
        </div>
    );
};

export default CandidateInfo;

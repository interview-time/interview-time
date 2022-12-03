import React, { useState } from "react";
import styles from "./candidate-details.module.css";
import heroImg from "../../assets/candidate-hero.png";
import { Avatar, Button, Modal, Space, Tag } from "antd";
import { getInitials } from "../../utils/string";
import { Candidate } from "../../store/models";
import CandidateStatusTag from "../../components/tags/candidate-status-tag";
import { Linkedin, Github, FileText, Mail, Phone, CalendarDays, Edit3, ChevronLeft } from "lucide-react";
import CreateCandidate from "./create-candidate";
import styled from "styled-components";
import IconButtonCopy from "../../components/buttons/icon-button-copy";
import IconButtonLink from "../../components/buttons/icon-button-link";
import IconButton from "../../components/buttons/icon-button";
import { useHistory } from "react-router-dom";

const DetailsWrapper = styled.div`
    border-radius: 8px 4px 4px 8px;
    background: #ffffff;
    margin-bottom: 32px;
    box-shadow: 0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06);
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const Actions = styled.div`
    display: flex;
    margin-top: 24px;
`;

const BackButton = styled.div`
    position: absolute;
    left: 24px;
    top: 30px;
`;

const EditButton = styled.div`
    position: absolute;
    right: 24px;
    top: 30px;
`;

const Name = styled.div`
    font-weight: 600;
    font-size: 24px;
    line-height: 20px;
    padding-top: 24px;
`;

const Info = styled(Space)`
    margin-top: 24px;
`;

const Location = styled(Tag)`
    font-size: 14px;
    font-weight: 500;
    color: #15803d;
    background: #f0fdf4;
    border-radius: 24px;
    border-style: hidden;
    padding: 2px 10px;
`;

type Props = {
    candidate: Candidate;
    onUpdateDetails?: any;
    onScheduleInterview?: any;
};

const CandidateDetails = ({ candidate, onUpdateDetails, onScheduleInterview }: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const history = useHistory();

    const openEditCandidate = () => setIsEditOpen(true);

    const backToCandidates = () => history.goBack();

    return (
        <DetailsWrapper>
            <Header>
                <img alt={candidate.candidateName} src={heroImg} width='100%' height='96' />

                <BackButton>
                    <IconButton icon={<ChevronLeft size={20} />} onClick={backToCandidates} />
                </BackButton>

                <EditButton>
                    <IconButton icon={<Edit3 size={20} />} onClick={openEditCandidate} />
                </EditButton>

                <Avatar src={null} className={styles.avatar} size={90}>
                    {getInitials(candidate.candidateName)}
                </Avatar>
            </Header>
            <div className={styles.details}>
                <Name>{candidate.candidateName}</Name>
                {candidate.position && <div className={styles.position}>{candidate.position}</div>}

                <Info>
                    {candidate.status && <CandidateStatusTag status={candidate.status} />}
                    {candidate.location && <Location>{candidate.location}</Location>}
                </Info>

                <Actions>
                    <IconButtonLink
                        icon={<Linkedin size={20} />}
                        link={candidate.linkedIn}
                        missingLinkText='Add LinkedIn url'
                        missingLinkAction={openEditCandidate}
                    />
                    <IconButtonLink
                        icon={<Github size={20} />}
                        link={candidate.gitHub}
                        missingLinkText='Add GitHub url'
                        missingLinkAction={openEditCandidate}
                    />
                    <IconButtonLink
                        icon={<FileText size={20} />}
                        link={candidate.resumeUrl}
                        missingLinkText='Upload CV'
                        missingLinkAction={openEditCandidate}
                    />
                    <IconButtonCopy
                        icon={<Mail size={20} />}
                        text={candidate.email}
                        missingLinkText='Add email address'
                        missingLinkAction={openEditCandidate}
                    />
                    <IconButtonCopy
                        icon={<Phone size={20} />}
                        text={candidate.phone}
                        missingLinkText='Add phone'
                        missingLinkAction={openEditCandidate}
                    />
                </Actions>

                {onScheduleInterview && (
                    <Button
                        type='primary'
                        icon={<CalendarDays size={14} style={{ marginRight: 5 }} />}
                        onClick={onScheduleInterview}
                        className={styles.scheduleInterview}
                    >
                        Schedule interview
                    </Button>
                )}
            </div>

            {/* @ts-ignore */}
            <Modal
                title='Candidate Details'
                centered={true}
                width={600}
                visible={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
            >
                <CreateCandidate
                    onCancel={() => setIsEditOpen(false)}
                    candidate={candidate}
                    onSave={() => setIsEditOpen(false)}
                />
            </Modal>
        </DetailsWrapper>
    );
};

export default CandidateDetails;

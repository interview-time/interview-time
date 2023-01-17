import { Avatar, Button, Space, Tag } from "antd";
import {
    Archive,
    ArchiveRestore,
    Briefcase,
    CalendarDays,
    ChevronLeft,
    Edit3,
    FileText,
    Github,
    Linkedin,
    Mail,
    Phone,
} from "lucide-react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import heroArchivedImg from "../../assets/archived.png";
import heroImg from "../../assets/candidate-hero.png";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import IconButton from "../../components/buttons/icon-button";
import IconButtonCopy from "../../components/buttons/icon-button-copy";
import IconButtonLink from "../../components/buttons/icon-button-link";
import { Candidate } from "../../store/models";
import { getInitials } from "../../utils/string";
import CreateCandidateModal from "../candidate-add/create-candidate-modal";

const Wrapper = styled.div`
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

const Details = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #111827;
    padding-bottom: 56px;
`;

const CandidateAvatar = styled(Avatar)`
    background-color: #e0f9eb;
    color: #1f2937;
    margin-top: -45px;
    font-size: 20px;
    font-weight: 500;
    border: 2px solid #ffffff;
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
    right: 74px;
    top: 30px;
`;

const ArchiveButton = styled.div`
    position: absolute;
    right: 24px;
    top: 30px;
`;

const Name = styled.div`
    font-weight: 600;
    font-size: 24px;
    line-height: 20px;
    margin-top: 24px;
`;

const Role = styled.div`
    margin-top: 16px;
    line-height: 20px;
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

const Archived = styled(Tag)`
    font-size: 14px;
    font-weight: 500;
    color: #b45309;
    background: #fffbeb;
    border-radius: 24px;
    border-style: hidden;
    padding: 2px 10px;
    margin-top: 24px;
`;

const ScheduleButton = styled(Button)`
    margin-top: 32px;
`;

type Props = {
    candidate: Candidate;
    onUpdateDetails?: any;
    onScheduleInterview?: any;
    onAssignToJobClicked: () => void;
    onArchive?: any;
    onRestoreArchive?: any;
};

const CandidateDetails = ({ candidate, onUpdateDetails, onScheduleInterview, onAssignToJobClicked, onArchive, onRestoreArchive }: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const history = useHistory();

    const openEditCandidate = () => setIsEditOpen(true);

    const backToCandidates = () => history.goBack();

    return (
        <Wrapper>
            <Header>
                <img
                    alt={candidate.candidateName}
                    src={candidate.archived ? heroArchivedImg : heroImg}
                    width='100%'
                    height='96'
                />

                <BackButton>
                    <IconButton icon={<ChevronLeft size={20} />} onClick={backToCandidates} />
                </BackButton>

                {!candidate.archived && (
                    <EditButton>
                        <IconButton icon={<Edit3 size={20} />} onClick={openEditCandidate} tooltip='Edit' />
                    </EditButton>
                )}

                <ArchiveButton>
                    {candidate.archived ? (
                        <IconButton
                            icon={<ArchiveRestore size={20} />}
                            onClick={onRestoreArchive}
                            tooltip='Restore archive'
                        />
                    ) : (
                        <IconButton icon={<Archive size={20} />} onClick={onArchive} tooltip='Archive' />
                    )}
                </ArchiveButton>

                <CandidateAvatar src={null} size={90}>
                    {getInitials(candidate.candidateName)}
                </CandidateAvatar>
            </Header>
            <Details>
                {candidate.archived && <Archived>Archived</Archived>}

                <Name>{candidate.candidateName}</Name>
                <Role>{candidate.jobTitle}</Role>
                <Info>{candidate.location && <Location>{candidate.location}</Location>}</Info>

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
                {!candidate.jobId && (
                    <ScheduleButton
                        type='primary'
                        icon={
                            <AntIconSpan>
                                <Briefcase size='1em' />
                            </AntIconSpan>
                        }
                        onClick={onAssignToJobClicked}
                    >
                        Assign to job
                    </ScheduleButton>
                )}

                {candidate.jobId && onScheduleInterview && (
                    <ScheduleButton
                        type='primary'
                        disabled={candidate.archived}
                        icon={
                            <AntIconSpan>
                                <CalendarDays size='1em' />
                            </AntIconSpan>
                        }
                        onClick={onScheduleInterview}
                    >
                        Schedule interview
                    </ScheduleButton>
                )}
            </Details>

            <CreateCandidateModal
                open={isEditOpen}
                candidate={candidate}
                onCancel={() => setIsEditOpen(false)}
                onSave={() => setIsEditOpen(false)}
            />
        </Wrapper>
    );
};

export default CandidateDetails;

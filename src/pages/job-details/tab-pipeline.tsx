import { Avatar, Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { cloneDeep } from "lodash";
import { Clock, MoreHorizontal, Plus, PlusSquare } from "lucide-react";
import React from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { arrayMove } from "react-sortable-hoc";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import {
    CardOutlined,
    SecondaryTextSmall,
    Tag,
    TagDanger,
    TagSlim,
    TagSuccess,
    TagWarning,
    TextBold,
    TextExtraBold,
} from "../../assets/styles/global-styles";
import { getCandidateStageStatusText } from "../../store/jobs/selectors";
import {
    CandidateDetails,
    CandidateStageStatus,
    JobStage,
    JobStageType,
    StageCandidate,
    Template,
} from "../../store/models";
import { hexToRgb } from "../../utils/colors";
import { log } from "../../utils/log";
import { getInitials } from "../../utils/string";
import ScheduleInterviewModal from "../interview-schedule/schedule-interview-modal";
import NewStageModal from "../job-new/new-stage-modal";
import AddCandidateModal from "./add-candidate-modal";

const Row = styled.div`
    display: flex;
    overflow-x: scroll;
    overflow-y: scroll;
`;

type StageColumnProps = {
    color: string;
};

const StageColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 276px;
    min-width: 276px;
    border-radius: 8px;
    min-height: 100px;
    margin-right: 24px;
    background-color: ${(props: StageColumnProps) => props.color};
`;

const StageTitle = styled(TextExtraBold)`
    line-height: 18px;
`;

const AddStageColumn = styled(StageColumn)`
    flex-direction: row;
    min-height: 40px;
    height: 40px;
    align-items: center;
    padding-left: 8px;
    padding-right: 8px;
    gap: 8px;
    color: ${Colors.Neutral_400};
    cursor: pointer;

    &:hover {
        background-color: ${Colors.Neutral_100};
    }
`;

const AddStageText = styled(TextBold)`
    color: ${Colors.Neutral_400};
`;

interface CandidateCardsColumnProps {
    isDraggingOver: boolean;
    color: string;
}

const CandidateCardsColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100px;
    border-radius: 8px;
    background-color: ${(props: CandidateCardsColumnProps) => (props.isDraggingOver ? props.color : "none")};
`;

const ColumnHeader = styled.div`
    display: flex;
    margin: 8px;
    gap: 12px;
    align-items: center;
`;

const ColumnHeaderGrip = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    flex-grow: 1;
`;

interface CandidateCardProps {
    isDragging: boolean;
}

const CandidateCard = styled(CardOutlined)`
    && {
        margin: 8px;
        padding: 16px;
        border-color: ${(props: CandidateCardProps) => (props.isDragging ? Colors.Primary_500 : Colors.Neutral_200)};
        cursor: pointer;
    }

    &:hover {
        border-color: ${Colors.Primary_500};
    }
`;

type StageColorBoxProps = {
    color: string;
};

const StageColorBox = styled.div`
    min-width: 20px;
    min-height: 20px;
    background: ${(props: StageColorBoxProps) => props.color};
    border-radius: 6px;
`;

const IconContainer = styled.div`
    display: inline-flex;
    justify-content: center;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
        background: ${Colors.Neutral_100};
    }
`;

const CandidateAvatar = styled(Avatar)`
    color: ${Colors.Primary_500};
    background-color: ${Colors.Primary_50};
    vertical-align: middle;
    font-weight: 600;
`;

const CandidateNameContainer = styled.div`
    display: inline-flex;
    gap: 8px;
    align-items: center;
`;

const Divider = styled.div`
    border-bottom: 1px solid ${Colors.Neutral_200};
    margin-top: 8px;
    margin-bottom: 16px;
`;

const CardMetaContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

enum DragType {
    StageColumn = "StageColumn",
    CandidateCard = "CandidateCard",
}

type NewStageModalProps = {
    visible: boolean;
    stage?: JobStage;
};

type AddCandidateModalProps = {
    visible: boolean;
    stageId?: string;
    jobId?: string;
};

type ScheduleInterviewModalProps = {
    visible: boolean;
    candidateId?: string;
};

type Props = {
    jobId: string;
    templates: Template[];
    jobStages: JobStage[];
    candidates: CandidateDetails[];
    onSaveStage: (stage: JobStage) => void;
    onRemoveStage: (stage: JobStage) => void;
    onUpdateStages: (stages: JobStage[]) => void;
    onCandidateMoveStages: (stages: JobStage[], candidateId: string, newStageId: string, position: number) => void;
    onCandidateCardClicked: (candidateId: string) => void;
    onCandidateCreated: () => void;
    onInterviewScheduled: () => void;
};

const TabPipeline = ({
    jobId,
    templates,
    jobStages,
    candidates,
    onSaveStage,
    onRemoveStage,
    onUpdateStages,
    onCandidateMoveStages,
    onCandidateCardClicked,
    onCandidateCreated,
    onInterviewScheduled,
}: Props) => {
    const [addCandidateModal, setAddCandidateModal] = React.useState<AddCandidateModalProps>({
        visible: false,
    });
    const [newStageModal, setNewStageModal] = React.useState<NewStageModalProps>({
        visible: false,
    });
    const [scheduleInterviewModal, setScheduleInterviewModal] = React.useState<ScheduleInterviewModalProps>({
        visible: false,
    });

    const createActionsMenu = (stage: JobStage): ItemType[] => [
        {
            key: "edit",
            label: "Edit",
            onClick: e => {
                e.domEvent.stopPropagation();
                setNewStageModal({
                    visible: true,
                    stage: stage,
                });
            },
        },
    ];

    const onAddStageClicked = () => {
        setNewStageModal({
            visible: true,
            stage: undefined,
        });
    };

    const onAddCandidateClicked = (stageId: string) => {
        setAddCandidateModal({
            visible: true,
            stageId: stageId,
            jobId: jobId,
        });
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === DragType.StageColumn) {
            log("Moving columns");
            onUpdateStages(arrayMove(jobStages, source.index, destination.index));
            return;
        }

        log("Moving card");
        const jobStagesNew = cloneDeep(jobStages);

        const sourceStage = jobStagesNew.find(stage => stage.stageId === source.droppableId);
        const sourceStageCandidates = sourceStage?.candidates || [];

        const destinationStage = jobStagesNew.find(stage => stage.stageId === destination.droppableId);
        const destinationStageCandidates = destinationStage?.candidates || [];

        if (!sourceStage || !destinationStage) {
            return;
        }

        const [removed] = sourceStageCandidates.splice(source.index, 1);
        destinationStageCandidates.splice(destination.index, 0, removed);
        destinationStage.candidates = destinationStageCandidates;

        if (sourceStage.stageId === destinationStage.stageId) {
            log("Moving card in the same column");
            onUpdateStages(jobStagesNew);
        } else {
            log("Moving card to another column");
            onCandidateMoveStages(jobStagesNew, removed.candidateId, destinationStage.stageId, destination.index);
            if (destinationStage.type === JobStageType.Interview) {
                setScheduleInterviewModal({
                    visible: true,
                    candidateId: removed.candidateId,
                });
            }
        }
    };

    const CandidateStageStatusTag = (status: CandidateStageStatus) => {
        if (status === CandidateStageStatus.AWAITING_FEEDBACK) {
            return <TagWarning>{getCandidateStageStatusText(status)}</TagWarning>;
        } else if (status === CandidateStageStatus.FEEDBACK_AVAILABLE) {
            return <TagSuccess>{getCandidateStageStatusText(status)}</TagSuccess>;
        } else if (status === CandidateStageStatus.SCHEDULE_INTERVIEW) {
            return <TagDanger>{getCandidateStageStatusText(status)}</TagDanger>;
        }

        return <Tag>{getCandidateStageStatusText(status)}</Tag>;
    };

    const renderCandidateCard = (candidate: StageCandidate, index: number) => {
        return (
            <Draggable key={candidate.candidateId} draggableId={candidate.candidateId} index={index}>
                {(provided, snapshot) => (
                    <CandidateCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        onClick={() => {
                            onCandidateCardClicked(candidate.candidateId);
                        }}
                    >
                        <CandidateNameContainer>
                            <CandidateAvatar size={26}>{getInitials(candidate.name)}</CandidateAvatar>
                            <TextBold>{candidate.name}</TextBold>
                        </CandidateNameContainer>
                        {candidate.position && <SecondaryTextSmall>{candidate.position}</SecondaryTextSmall>}
                        <Divider />
                        <CardMetaContainer>
                            <TagSlim>
                                <Clock size={16} />
                                4d
                            </TagSlim>
                            {candidate.status && CandidateStageStatusTag(candidate.status)}
                        </CardMetaContainer>
                    </CandidateCard>
                )}
            </Draggable>
        );
    };

    const renderCandidateCardsColumn = (stage: JobStage) => (
        <Droppable droppableId={stage.stageId} type={DragType.CandidateCard}>
            {(provided, snapshot) => (
                <CandidateCardsColumn
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    isDraggingOver={snapshot.isDraggingOver}
                    color={hexToRgb(stage.colour, 0.05)}
                >
                    {stage.candidates?.map((candidate, index) => renderCandidateCard(candidate, index))}
                    {provided.placeholder}
                </CandidateCardsColumn>
            )}
        </Droppable>
    );

    const renderStageColumn = (stage: JobStage, index: number) => (
        <Draggable key={stage.stageId} draggableId={stage.stageId} index={index}>
            {provided => (
                <StageColumn ref={provided.innerRef} {...provided.draggableProps} color={Colors.Neutral_50}>
                    <ColumnHeader>
                        <ColumnHeaderGrip {...provided.dragHandleProps}>
                            <StageColorBox color={stage.colour} />
                            <StageTitle>{stage.title}</StageTitle>
                            <TagSlim textColor={stage.colour} backgroundColor={hexToRgb(stage.colour, 0.1)}>
                                {stage.candidates?.length || 0}
                            </TagSlim>
                        </ColumnHeaderGrip>
                        <IconContainer onClick={() => onAddCandidateClicked(stage.stageId)}>
                            <Plus size={20} color={Colors.Neutral_500} />
                        </IconContainer>
                        <IconContainer>
                            <Dropdown
                                menu={{
                                    items: createActionsMenu(stage),
                                }}
                            >
                                <MoreHorizontal size={20} color={Colors.Neutral_500} />
                            </Dropdown>
                        </IconContainer>
                    </ColumnHeader>
                    {renderCandidateCardsColumn(stage)}
                </StageColumn>
            )}
        </Draggable>
    );

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='pipeline-stages' direction='horizontal' type={DragType.StageColumn}>
                    {provided => (
                        <Row {...provided.droppableProps} ref={provided.innerRef}>
                            {jobStages.map((stage: JobStage, index: number) => renderStageColumn(stage, index))}
                            {provided.placeholder}
                            <AddStageColumn color={Colors.Neutral_50} onClick={onAddStageClicked}>
                                <PlusSquare /> <AddStageText>Add new stage</AddStageText>
                            </AddStageColumn>
                        </Row>
                    )}
                </Droppable>
            </DragDropContext>
            <NewStageModal
                open={newStageModal.visible}
                stage={newStageModal.stage}
                templates={templates}
                onClose={() => {
                    setNewStageModal({
                        ...newStageModal,
                        visible: false,
                    });
                }}
                onSave={stage => {
                    setNewStageModal({
                        ...newStageModal,
                        visible: false,
                    });
                    onSaveStage(stage);
                }}
                onRemove={stage => {
                    setNewStageModal({
                        ...newStageModal,
                        visible: false,
                    });
                    onRemoveStage(stage);
                }}
            />

            <AddCandidateModal
                candidates={candidates}
                open={addCandidateModal.visible}
                stageId={addCandidateModal.stageId}
                jobId={addCandidateModal.jobId}
                onCandidateCreated={onCandidateCreated}
                onClose={() =>
                    setAddCandidateModal({
                        visible: false,
                    })
                }
            />

            <ScheduleInterviewModal
                open={scheduleInterviewModal.visible}
                candidateId={scheduleInterviewModal.candidateId}
                alwaysFetchCandidate={true}
                onClose={interviewChanged => {
                    setScheduleInterviewModal({
                        visible: false,
                    });
                    if (interviewChanged) {
                        onInterviewScheduled();
                    }
                }}
            />
        </>
    );
};

export default TabPipeline;

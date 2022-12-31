import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { CandidateStageStatus, JobStage, StageCandidate } from "../../store/models";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { Clock, GripHorizontal, Plus, PlusSquare } from "lucide-react";
import { Avatar } from "antd";
import { cloneDeep } from "lodash";
import { arrayMove } from "react-sortable-hoc";
import React from "react";
import { getInitials } from "../../utils/string";
import { hexToRgb } from "../../utils/colors";
import { getCandidateStageStatusText } from "../../store/jobs/selectors";
import NewStageModal from "../job-new/new-stage-modal";
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

interface CandidateCardProps {
    isDragging: boolean;
}

const CandidateCard = styled(CardOutlined)`
    margin: 8px;
    padding: 16px;
    border-color: ${(props: CandidateCardProps) => (props.isDragging ? Colors.Primary_500 : Colors.Neutral_200)};
`;

type StageColorBoxProps = {
    color: string;
};

const StageColorBox = styled.div`
    width: 20px;
    height: 20px;
    background: ${(props: StageColorBoxProps) => props.color};
    border-radius: 6px;
`;

const Space = styled.div`
    flex-grow: 1;
`;

const IconContainer = styled.div`
    display: inline-flex;
    justify-content: center;
`;

const CandidateAvatar = styled(Avatar)`
    color: ${Colors.Primary_500};
    background-color: ${Colors.Primary_50};
    vertical-align: middle;
    font-size: 14px;
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

type Props = {
    jobStages: JobStage[];
    onAddStage: (stage: JobStage) => void;
    onStagesOrderChange: (stages: JobStage[]) => void;
};

const TabPipeline = ({ jobStages, onAddStage, onStagesOrderChange }: Props) => {
    const [addStageModalVisible, setAddStageModalVisible] = React.useState<boolean>(false);

    const onAddStageClicked = () => {
        setAddStageModalVisible(true);
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
            onStagesOrderChange(arrayMove(jobStages, source.index, destination.index));
            return;
        }

        const jobStagesNew = cloneDeep(jobStages);

        const sourceStage = jobStagesNew.find(stage => stage.stageId === source.droppableId);
        const sourceStageCandidates = sourceStage?.candidates || [];

        const destinationStage = jobStagesNew.find(stage => stage.stageId === destination.droppableId);
        const destinationStageCandidates = destinationStage?.candidates || [];

        if (sourceStage && destinationStage) {
            const [removed] = sourceStageCandidates.splice(source.index, 1);
            destinationStageCandidates.splice(destination.index, 0, removed);
            destinationStage.candidates = destinationStageCandidates;
        }

        onStagesOrderChange(jobStagesNew);
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
                <StageColumn ref={provided.innerRef} {...provided.draggableProps} color={hexToRgb(stage.colour, 0.05)}>
                    <ColumnHeader>
                        <StageColorBox color={stage.colour} />
                        <TextExtraBold>{stage.title}</TextExtraBold>
                        <TagSlim textColor={stage.colour} backgroundColor={hexToRgb(stage.colour, 0.1)}>
                            {stage.candidates?.length || 0}
                        </TagSlim>
                        <Space />
                        <IconContainer>
                            <Plus size={20} color={Colors.Neutral_500} />
                        </IconContainer>
                        <IconContainer {...provided.dragHandleProps}>
                            <GripHorizontal size={20} color={Colors.Neutral_500} />
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
                open={addStageModalVisible}
                templates={[]}
                onClose={() => setAddStageModalVisible(false)}
                onSave={stage => {
                    setAddStageModalVisible(false);
                    onAddStage(stage);
                }}
                onRemove={() => {
                    /** no edit mode **/
                }}
            />
        </>
    );
};

export default TabPipeline;

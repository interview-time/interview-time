import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { CardOutlined, SecondaryTextSmall, TextBold, TextExtraBold } from "../../assets/styles/global-styles";
import { JobCandidate, JobStage } from "../../store/models";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { Clock, GripHorizontal, Plus } from "lucide-react";
import { Avatar } from "antd";
import { cloneDeep } from "lodash";
import { arrayMove } from "react-sortable-hoc";
import React from "react";
import { getInitials } from "../../utils/string";
const Row = styled.div`
    display: flex;
`;

const StageColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 276px;
    border-radius: 8px;
    min-height: 100px;
    margin-right: 24px;
    background-color: ${Colors.Neutral_50};
`;

interface CandidateCardsColumnProps {
    isDraggingOver: boolean;
}

const CandidateCardsColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100px;
    border-radius: 8px;
    background-color: ${(props: CandidateCardsColumnProps) =>
        props.isDraggingOver ? Colors.Neutral_100 : Colors.Neutral_50};
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
    //height: 108px;
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

const StageTitle = styled(TextExtraBold)`
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

const Tag = styled.div`
    background: ${Colors.Neutral_100};
    color: ${Colors.Neutral_600};
    border-radius: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    gap: 4px;
    height: 24px;
`;

const TagIcon = styled(Tag)`
    padding-left: 8px;
    padding-right: 8px;
`;

const TagText = styled(SecondaryTextSmall)`
    color: ${Colors.Neutral_600};
    font-weight: 500;
`;

enum DragType {
    StageColumn = "StageColumn",
    CandidateCard = "CandidateCard",
}

type Props = {
    jobStages: JobStage[];
    onStagesChange: (stages: JobStage[]) => void;
};

const TabPipeline = ({ jobStages, onStagesChange }: Props) => {
    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === DragType.StageColumn) {
            onStagesChange(arrayMove(jobStages, source.index, destination.index));
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

        onStagesChange(jobStagesNew);
    };

    const renderCandidateCard = (jobCandidate: JobCandidate, index: number) => {
        return (
            <Draggable key={jobCandidate.candidateId} draggableId={jobCandidate.candidateId} index={index}>
                {(provided, snapshot) => (
                    <CandidateCard
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                    >
                        <CandidateNameContainer>
                            <CandidateAvatar size={26}>{getInitials(jobCandidate.name)}</CandidateAvatar>
                            <TextBold>{jobCandidate.name}</TextBold>
                        </CandidateNameContainer>
                        {jobCandidate.position && <SecondaryTextSmall>{jobCandidate.position}</SecondaryTextSmall>}
                        <Divider />
                        <CardMetaContainer>
                            <TagIcon>
                                <Clock size={16} />
                                <TagText>4d</TagText>
                            </TagIcon>
                            <Tag>
                                <TagText>{jobCandidate.status}</TagText>
                            </Tag>
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
                >
                    {stage.candidates?.map((candidate, index) => renderCandidateCard(candidate, index))}
                    {provided.placeholder}
                </CandidateCardsColumn>
            )}
        </Droppable>
    );

    const renderStageColumn = (stage: JobStage, index: number) => (
        <Draggable key={stage.stageId} draggableId={stage.stageId} index={index}>
            {(provided, snapshot) => (
                <StageColumn ref={provided.innerRef} {...provided.draggableProps}>
                    <ColumnHeader>
                        <StageColorBox color={stage.colour} />
                        <StageTitle>{stage.title}</StageTitle>
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
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='pipeline-stages' direction='horizontal' type={DragType.StageColumn}>
                {provided => (
                    <Row {...provided.droppableProps} ref={provided.innerRef}>
                        {jobStages.map((stage: JobStage, index: number) => renderStageColumn(stage, index))}
                        {provided.placeholder}
                    </Row>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TabPipeline;

import { Content, FormContainer, NextButton, SecondaryText, SecondaryTextSmall, TextBold } from "./styles";
import React from "react";
import { Button, Typography } from "antd";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { JobStage } from "../../store/models";
import { CardOutlined } from "../../assets/styles/global-styles";
import { GripHorizontal, Plus } from "lucide-react";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { arrayMove } from "react-sortable-hoc";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import NewStageModal from "./new-stage-modal";
import { cloneDeep } from "lodash";
import ScrumBoardImage from "../../assets/illustrations/undraw_scrum_board.svg";
import { ApiRequestStatus } from "../../store/state-models";

const { Title } = Typography;

const FormContainerNoGap = styled(FormContainer)`
    gap: 0;
`;

const StageList = styled.div`
    width: 600px;
    display: flex;
    flex-direction: column;
`;

const StageDragContainer = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
`;

interface StageCardProps {
    isDragging: boolean;
}

const StageCard = styled(CardOutlined)`
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    flex-grow: 1;
    border-color: ${(props: StageCardProps) => (props.isDragging ? Colors.Primary_500 : Colors.Neutral_200)};
    cursor: pointer;
`;

type StageColorBoxProps = {
    color: string;
};

const StageColorBox = styled.div`
    width: 16px;
    height: 16px;
    background: ${(props: StageColorBoxProps) => props.color};
    border-radius: 6px;
    margin-top: 4px;
`;

const StageTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const GripContainer = styled.div`
    padding-top: 12px;
`;

const AddStageContainer = styled.div`
    text-align: center;
`;

const PlaceholderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 24px;
`;

const PlaceholderText = styled(SecondaryText)`
    max-width: 300px;
    margin-top: 24px;
    text-align: center;
`;

type EditStageModal = {
    visible: boolean;
    stage?: JobStage;
};

type Props = {
    stages: JobStage[];
    createJobStatus: ApiRequestStatus;
    onStagesChange: (stages: JobStage[]) => void;
    onFinish: () => void;
};

const StepJobStages = ({ stages, createJobStatus, onStagesChange, onFinish }: Props) => {
    const [editStageModal, setEditStageModal] = React.useState<EditStageModal>({
        visible: false,
    });

    const onSaveStage = (stage: JobStage) => {
        const index = stages.findIndex(s => s.stageId === stage.stageId);
        const updatedStages = cloneDeep(stages);
        if (index === -1) {
            updatedStages.push(stage);
        } else {
            updatedStages[index] = stage;
        }
        onStagesChange(updatedStages);
        setEditStageModal({ ...editStageModal, visible: false });
    };

    const onRemoveStage = (stage: JobStage) => {
        onStagesChange(stages.filter(s => s.stageId !== stage.stageId));
        setEditStageModal({ ...editStageModal, visible: false });
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        onStagesChange(arrayMove(stages, source.index, destination.index));
    };

    const StageListItem = (stage: JobStage, index: number) => (
        <Draggable key={stage.stageId} draggableId={stage.stageId} index={index}>
            {(provided, snapshot) => (
                <StageDragContainer ref={provided.innerRef} {...provided.draggableProps}>
                    <GripContainer {...provided.dragHandleProps}>
                        <GripHorizontal color={Colors.Neutral_500} />
                    </GripContainer>
                    <StageCard
                        isDragging={snapshot.isDragging}
                        onClick={() => setEditStageModal({ visible: true, stage: stage })}
                    >
                        <StageColorBox color={stage.colour} />
                        <StageTextContainer>
                            <TextBold>{stage.title}</TextBold>
                            <SecondaryTextSmall>{stage.description}</SecondaryTextSmall>
                        </StageTextContainer>
                    </StageCard>
                </StageDragContainer>
            )}
        </Draggable>
    );

    return (
        <>
            <Content>
                <Title level={4}>Pipeline stages</Title>
                <SecondaryText>Design structured interview process</SecondaryText>

                <FormContainerNoGap>
                    {stages.length === 0 && (
                        <PlaceholderContainer>
                            <img src={ScrumBoardImage} width={200} alt='Pipeline Board' />
                            <PlaceholderText>
                                Add recruiting pipeline stages to visualise your hiring process.
                            </PlaceholderText>
                        </PlaceholderContainer>
                    )}

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId='stages'>
                            {provided => (
                                <StageList {...provided.droppableProps} ref={provided.innerRef}>
                                    {stages.map((stage, index) => StageListItem(stage, index))}
                                    {provided.placeholder}
                                </StageList>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <AddStageContainer>
                        <Button
                            type='link'
                            icon={
                                <AntIconSpan>
                                    <Plus size='1em' />
                                </AntIconSpan>
                            }
                            onClick={() => setEditStageModal({ visible: true })}
                        >
                            Add new stage
                        </Button>
                    </AddStageContainer>

                    {stages.length > 0 && (
                        <NextButton
                            type='primary'
                            onClick={onFinish}
                            loading={createJobStatus === ApiRequestStatus.InProgress}
                        >
                            Finish
                        </NextButton>
                    )}
                </FormContainerNoGap>
            </Content>

            <NewStageModal
                open={editStageModal.visible}
                stage={editStageModal.stage}
                onClose={() =>
                    setEditStageModal({
                        ...editStageModal,
                        visible: false,
                    })
                }
                onSave={onSaveStage}
                onRemove={onRemoveStage}
            />
        </>
    );
};

export default StepJobStages;

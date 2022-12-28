import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchJobDetails } from "../../store/jobs/actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/state-models";
import { selectJobDetails } from "../../store/jobs/selectors";
import { JobCandidate, JobDetails, JobStage } from "../../store/models";
import { Typography } from "antd";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { CardOutlined, TextExtraBold } from "../../assets/styles/global-styles";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { cloneDeep } from "lodash";
import { arrayMoveMutable } from "array-move";

const { Text } = Typography;

const RootLayout = styled.div`
    padding: 32px;
`;

const Row = styled.div`
    display: flex;
    gap: 24px;
`;

const StageColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 276px;
    border-radius: 8px;
    background-color: ${Colors.Neutral_50};
    min-height: 100px;
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
    height: 108px;
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

enum DragType {
    StageColumn = "StageColumn",
    CandidateCard = "CandidateCard",
}

const JobDetailsPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { id } = useParams<Record<string, string>>();

    const jobDetailsOriginal: JobDetails | undefined = useSelector(
        (state: RootState) => selectJobDetails(state, id),
        shallowEqual
    );

    const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();

    const candidates: JobCandidate[] = [
        {
            candidateId: "1",
            name: "Jon Doe 1",
            position: "1",
            status: "1",
            movedToStage: "1",
            originallyAdded: "1",
        },
        {
            candidateId: "2",
            name: "Jon Doe 2",
            position: "1",
            status: "1",
            movedToStage: "1",
            originallyAdded: "1",
        },
        {
            candidateId: "3",
            name: "Jon Doe 3",
            position: "1",
            status: "1",
            movedToStage: "1",
            originallyAdded: "1",
        },
    ];

    useEffect(() => {
        if (jobDetailsOriginal) {
            jobDetailsOriginal.pipeline[0].candidates = candidates;
            setJobDetails(jobDetailsOriginal);
        }
        // eslint-disable-next-line
    }, [jobDetailsOriginal]);

    useEffect(() => {
        dispatch(fetchJobDetails(id));
        // eslint-disable-next-line
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (!jobDetails) {
            return;
        }

        const newJobDetails = cloneDeep(jobDetails);

        if (type === DragType.StageColumn) {
            arrayMoveMutable(newJobDetails.pipeline, source.index, destination.index);
            setJobDetails(newJobDetails);
            console.log(newJobDetails);
            return;
        }

        const sourceStage = newJobDetails.pipeline.find(stage => stage.stageId === source.droppableId);
        const sourceStageCandidates = sourceStage?.candidates || [];

        const destinationStage = newJobDetails.pipeline.find(stage => stage.stageId === destination.droppableId);
        const destinationStageCandidates = destinationStage?.candidates || [];

        if (sourceStage && destinationStage) {
            const [removed] = sourceStageCandidates.splice(source.index, 1);
            destinationStageCandidates.splice(destination.index, 0, removed);
            destinationStage.candidates = destinationStageCandidates;
        }

        setJobDetails(newJobDetails);
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
                        <Text>{jobCandidate.name}</Text>
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
                <StageColumn ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <ColumnHeader>
                        <StageColorBox color={stage.colour} />
                        <TextExtraBold>{stage.title}</TextExtraBold>
                    </ColumnHeader>
                    {renderCandidateCardsColumn(stage)}
                </StageColumn>
            )}
        </Draggable>
    );

    return (
        <RootLayout>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='pipeline-stages' direction='horizontal' type={DragType.StageColumn}>
                    {provided => (
                        <Row {...provided.droppableProps} ref={provided.innerRef}>
                            {jobDetails?.pipeline.map((stage: JobStage, index) => renderStageColumn(stage, index))}
                            {provided.placeholder}
                        </Row>
                    )}
                </Droppable>
            </DragDropContext>
        </RootLayout>
    );
};

export default JobDetailsPage;

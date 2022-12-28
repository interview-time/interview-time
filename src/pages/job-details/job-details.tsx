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

const { Text } = Typography;

const RootLayout = styled.div`
    padding: 32px;
`;

const Row = styled.div`
    display: flex;
    gap: 24px;
`;

interface ColumnProps {
    isDraggingOver: boolean;
}

const StageColumn = styled.div`
    display: flex;
    flex-direction: column;
    width: 276px;
    border-radius: 8px;
    background-color: ${Colors.Neutral_50};
    min-height: 100px;
    background-color: ${(props: ColumnProps) => (props.isDraggingOver ? Colors.Neutral_100 : Colors.Neutral_50)};
`;

const CandidateCardsColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100px;
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
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newJobDetails = cloneDeep(jobDetails);

        const sourceStage = newJobDetails?.pipeline.find(stage => stage.stageId === source.droppableId);
        const sourceStageCandidates = sourceStage?.candidates || [];

        const destinationStage = newJobDetails?.pipeline.find(stage => stage.stageId === destination.droppableId);
        const destinationStageCandidates = destinationStage?.candidates || [];

        if (sourceStage && destinationStage) {
            const [removed] = sourceStageCandidates.splice(source.index, 1);
            destinationStageCandidates.splice(destination.index, 0, removed);
            destinationStage.candidates = destinationStageCandidates;
        }

        console.log("source", source);
        console.log("destination", destination);

        console.log("newJobDetails", newJobDetails);
        setJobDetails(newJobDetails);
    };

    const createCandidateCard = (jobCandidate: JobCandidate, index: number) => {
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

    const createStageColumn = (stage: JobStage) => (
        <Droppable droppableId={stage.stageId}>
            {(provided, snapshot) => (
                <StageColumn isDraggingOver={snapshot.isDraggingOver}>
                    <ColumnHeader>
                        <StageColorBox color={stage.colour} />
                        <TextExtraBold>{stage.title}</TextExtraBold>
                    </ColumnHeader>
                    <CandidateCardsColumn {...provided.droppableProps} ref={provided.innerRef}>
                        {(stage.candidates || []).map((candidate, index) => createCandidateCard(candidate, index))}
                        {provided.placeholder}
                    </CandidateCardsColumn>
                </StageColumn>
            )}
        </Droppable>
    );

    return (
        <RootLayout>
            <DragDropContext onDragEnd={onDragEnd}>
                <Row>{jobDetails?.pipeline.map((stage: JobStage) => createStageColumn(stage))}</Row>
            </DragDropContext>
        </RootLayout>
    );
};

export default JobDetailsPage;

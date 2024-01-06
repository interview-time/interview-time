import { Link } from "react-router-dom";
import { routeCandidateProfile, routeHome } from "../../utils/route";
import { getCandidateName2 } from "../../store/interviews/selector";
import { Button, Segmented, Space } from "antd";
import { BackIcon, CloseIcon } from "../../utils/icons";
import TimeAgo from "../../components/time-ago/time-ago";
import InterviewStatusTag from "../../components/tags/interview-status-tags";
import MenuNoneIcon from "../../components/icons/menu-none-icon";
import MenuRightIcon from "../../components/icons/menu-right-icon";
import Header from "../../components/header/header";
import React from "react";
import { Candidate, Interview } from "../../store/models";
import { SegmentedValue } from "antd/lib/segmented";
import { History } from "history";

type Props = {
    candidate?: Candidate;
    interview: Interview;
    history: History;
    interviewStarted: boolean;
    interviewCompleted: boolean;
    interviewUploading: boolean;
    onPanelVisibilityChange: (visible: boolean) => void;
    onEditClicked: () => void;
    onCompleteClicked: () => void;
    onSubmitClicked: () => void;
};

const InterviewScorecardHeader = ({
    candidate,
    interview,
    history,
    interviewStarted,
    interviewCompleted,
    interviewUploading,
    onPanelVisibilityChange,
    onEditClicked,
    onCompleteClicked,
    onSubmitClicked,
}: Props) => {
    const PANEL_INVISIBLE = "panel-invisible";
    const PANEL_VISIBLE = "panel-visible";

    const onChange = (value: SegmentedValue) => onPanelVisibilityChange(value === PANEL_VISIBLE);

    return (
        <Header
            title={
                <Link
                    to={routeCandidateProfile(candidate?.candidateId)}
                    target='_blank'
                    style={{ color: "rgba(0, 0, 0, 0.85)" }}
                >
                    {getCandidateName2(interview, candidate)}
                </Link>
            }
            subtitle={candidate?.position ?? ""}
            leftComponent={
                <Space size={16}>
                    {history.action !== "POP" ? (
                        <Button icon={<BackIcon />} size='large' onClick={() => history.goBack()} />
                    ) : (
                        <Button icon={<CloseIcon />} size='large' onClick={() => history.replace(routeHome())} />
                    )}
                    <TimeAgo timestamp={interview.modifiedDate} saving={interviewUploading} />
                </Space>
            }
            rightComponent={
                <Space size={16}>
                    <InterviewStatusTag
                        interviewStartDateTime={new Date(interview.interviewDateTime)}
                        status={interview.status}
                    />
                    {interviewStarted && (
                        <>
                            {/*@ts-ignore*/}
                            <Segmented
                                options={[
                                    {
                                        value: PANEL_INVISIBLE,
                                        icon: <MenuNoneIcon style={{ fontSize: 32 }} />,
                                    },
                                    {
                                        value: PANEL_VISIBLE,
                                        icon: <MenuRightIcon style={{ fontSize: 32 }} />,
                                    },
                                ]}
                                defaultValue={PANEL_VISIBLE}
                                onChange={onChange}
                            />
                            <Button type='primary' onClick={onCompleteClicked}>
                                Complete Interview
                            </Button>
                        </>
                    )}
                    {interviewCompleted && (
                        <>
                            <Button onClick={onEditClicked}>Edit</Button>
                            <Button type='primary' onClick={onSubmitClicked}>
                                Submit Evaluation
                            </Button>
                        </>
                    )}
                </Space>
            }
        />
    );
};

export default InterviewScorecardHeader;

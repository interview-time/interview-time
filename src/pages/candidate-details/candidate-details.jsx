import { connect } from "react-redux";
import { deleteCandidate, loadCandidates, updateCandidate } from "../../store/candidates/actions";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import styles from "./candidate-details.module.css";
import { Button, Dropdown, Menu, Modal, Space } from "antd";
import Header from "../../components/header/header";
import { createCloseBackButton } from "../../components/header/header-utils";
import CandidateInfo from "./candidate-info";
import { deleteInterview, loadInterviews } from "../../store/interviews/actions";
import { cloneDeep, isEmpty } from "lodash/lang";
import { getFormattedDateShort } from "../../components/utils/date";
import Layout from "../../components/layout/layout";
import { loadTeamMembers } from "../../store/user/actions";
import { MoreIcon } from "../../components/utils/icons";
import { routeCandidates } from "../../components/utils/route";
import CreateCandidate from "./create-candidate";
import { selectCandidateInterviews } from "../../store/interviews/selector";

/**
 *
 * @param {UserProfile} profile
 * @param {Candidate[]} candidates
 * @param {Interview[]} interviews
 * @param  loadCandidates
 * @param  loadInterviews
 * @param  updateCandidate
 * @param  loadTeamMembers
 * @param  deleteInterview
 * @param  deleteCandidate
 * @constructor
 */
const CandidateDetails = ({
    profile,
    candidates,
    interviews,
    loadCandidates,
    loadInterviews,
    updateCandidate,
    loadTeamMembers,
    deleteInterview,
    deleteCandidate,
}) => {
    const { id } = useParams();
    const history = useHistory();

    const STATE_DETAILS = 1;
    const STATE_EDIT = 2;

    const [state, setState] = useState(STATE_DETAILS);
    const [candidate, setCandidate] = useState(/** @type {Candidate|undefined} */ undefined);
    const [candidateInterviews, setCandidateInterviews] = useState(/** @type {Interview[]|undefined} */ []);

    useEffect(() => {
        if (!isEmpty(candidates)) {
            setCandidate(candidates.find(candidate => candidate.candidateId === id));
        }
        // eslint-disable-next-line
    }, [candidates]);

    useEffect(() => {
        if (!isEmpty(interviews)) {
            setCandidateInterviews(interviews);
        }
        // eslint-disable-next-line
    }, [interviews]);

    useEffect(() => {
        loadCandidates();
        loadInterviews();
        loadTeamMembers(profile.currentTeamId);
        // eslint-disable-next-line
    }, []);

    const updateStatus = status => {
        const updatedCandidate = cloneDeep(candidate);
        updatedCandidate.status = status;
        updateCandidate(updatedCandidate);
    };

    const archive = () => {
        const updatedCandidate = cloneDeep(candidate);
        updatedCandidate.archived = true;
        updateCandidate(updatedCandidate);
    };

    const undoArchive = () => {
        const updatedCandidate = cloneDeep(candidate);
        updatedCandidate.archived = false;
        updateCandidate(updatedCandidate);
    };

    const showDeleteDialog = () => {
        Modal.confirm({
            title: "Delete Candidate",
            content: `Are you sure you want to delete this candidate and all related interview data?`,
            okText: "Yes",
            cancelText: "No",
            onOk() {
                history.push(routeCandidates());
                deleteCandidate(candidate.candidateId);
            },
        });
    };

    const onEditClicked = () => {
        setState(STATE_EDIT);
    };

    const onEditCancel = () => {
        setState(STATE_DETAILS);
    };

    const onCandidateUpdate = () => {
        setState(STATE_DETAILS);
    };

    const createMenu = () => (
        <Menu>
            <Menu.Item
                danger
                onClick={e => {
                    e.domEvent.stopPropagation();
                    showDeleteDialog();
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout contentStyle={styles.rootContainer}>
            {candidate ? (
                <div>
                    <Header
                        title='Candidate Profile'
                        subtitle={`Created on ${getFormattedDateShort(candidate.createdDate)}`}
                        leftComponent={createCloseBackButton(history)}
                        rightComponent={
                            <Space>
                                <Button onClick={archive} disabled={candidate.archived}>
                                    Archive
                                </Button>
                                <Button disabled={candidate.archived} onClick={onEditClicked}>
                                    Edit
                                </Button>
                                <Dropdown overlay={createMenu()} placement='bottomLeft'>
                                    <Button icon={<MoreIcon />} onClick={e => e.stopPropagation()} />
                                </Dropdown>
                            </Space>
                        }
                    />

                    {state === STATE_DETAILS && (
                        <CandidateInfo
                            interviews={candidateInterviews}
                            profile={profile}
                            candidate={candidate}
                            onUpdateStatus={updateStatus}
                            onDeleteInterview={deleteInterview}
                            onUndoArchive={undoArchive}
                        />
                    )}
                    {state === STATE_EDIT && (
                        <div className={styles.candidateInfoContainer}>
                            <CreateCandidate
                                onCancel={onEditCancel}
                                candidate={candidate}
                                teamId={profile.currentTeamId}
                                onSave={onCandidateUpdate}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Spinner />
            )}
        </Layout>
    );
};

const mapDispatch = {
    loadCandidates,
    updateCandidate,
    loadInterviews,
    deleteInterview,
    loadTeamMembers,
    deleteCandidate,
};

const mapState = (state, ownProps) => {
    const candidatesState = state.candidates || {};
    const userState = state.user || {};

    return {
        profile: userState.profile,
        candidates: candidatesState.candidates,
        interviews: selectCandidateInterviews(state, ownProps.match.params.id),
    };
};

export default connect(mapState, mapDispatch)(CandidateDetails);

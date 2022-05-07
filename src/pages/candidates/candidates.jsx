import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { Button, Checkbox, Dropdown, Menu, Modal, Select, Table } from "antd";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import { localeCompare } from "../../components/utils/comparators";
import TableText from "../../components/table/table-text";
import { orderBy } from "lodash/collection";
import Title from "antd/lib/typography/Title";
import TableHeader from "../../components/table/table-header";
import { deleteCandidate, loadCandidates, updateCandidate } from "../../store/candidates/actions";
import CandidateStatusTag, { getCandidateStatusText } from "../../components/tags/candidate-status-tag";
import styles from "./candidates.module.css";
import { routeCandidateDetails, routeCandidates } from "../../components/utils/route";
import { useHistory } from "react-router-dom";
import ArchivedTag from "../../components/tags/candidate-archived-tag";
import { CandidateStatus } from "../../components/utils/constants";
import { filterOptionLabel } from "../../components/utils/filters";
import { MoreIcon } from "../../components/utils/icons";
import { cloneDeep } from "lodash/lang";
import { getFormattedDateShort } from "../../components/utils/date-fns";

/**
 *
 * @param {Candidate[]} candidatesData
 * @param loadCandidates
 * @param updateCandidate
 * @param deleteCandidate
 * @param loading
 * @returns {JSX.Element}
 * @constructor
 */
const Candidates = ({ candidatesData, loading, loadCandidates, updateCandidate, deleteCandidate }) => {
    const history = useHistory();

    const [candidates, setCandidates] = useState([]);
    const [filter, setFilter] = useState({
        status: null,
        displayArchived: true,
    });

    React.useEffect(() => {
        loadCandidates();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        updateCandidatesState();
        // eslint-disable-next-line
    }, [candidatesData, filter]);

    const updateCandidatesState = () => {
        let filteredCandidates = candidatesData;

        if (!filter.displayArchived) {
            filteredCandidates = filteredCandidates.filter(c => !c.archived);
        }

        if (filter.status) {
            filteredCandidates = filteredCandidates.filter(c => c.status === filter.status);
        }

        setCandidates(filteredCandidates);
    };

    const archive = candidate => {
        const updatedCandidate = cloneDeep(candidate);
        candidate.archived = true;
        updateCandidate(updatedCandidate);
    };

    const undoArchive = candidate => {
        const updatedCandidate = cloneDeep(candidate);
        candidate.archived = false;
        updateCandidate(updatedCandidate);
    };

    const showDeleteDialog = candidate => {
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

    const createMenu = candidate => (
        <Menu>
            <Menu.Item
                onClick={e => {
                    e.domEvent.stopPropagation();
                    if (candidate.archived) {
                        undoArchive(candidate);
                    } else {
                        archive(candidate);
                    }
                }}
            >
                {candidate.archived ? "Undo Archive" : "Archive"}
            </Menu.Item>
            <Menu.Item
                danger
                onClick={e => {
                    e.domEvent.stopPropagation();
                    showDeleteDialog(candidate);
                }}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidateName",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidateName, b.candidateName),
            render: candidate => <TableText className={`fs-mask`}>{candidate.candidateName}</TableText>,
        },
        {
            title: <TableHeader>CREATED DATE</TableHeader>,
            key: "createdDate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.createdDate, b.createdDate),
            render: candidate => (
                <TableText>{getFormattedDateShort(candidate.createdDate, "-")}</TableText>
            ),
        },
        {
            title: <TableHeader>INTERVIEWS</TableHeader>,
            key: "interviews",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviews, b.interviews),
            render: candidate => <TableText>{candidate.totalInterviews}</TableText>,
        },
        {
            title: <TableHeader>STATUS</TableHeader>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: candidate => (
                <div>
                    <CandidateStatusTag status={candidate.status} />
                    {candidate.archived ? <ArchivedTag /> : null}
                </div>
            ),
        },
        {
            key: "actions",
            render: candidate => (
                <Dropdown overlay={createMenu(candidate)} placement='bottomLeft'>
                    <Button icon={<MoreIcon />} style={{ width: 36, height: 36 }} onClick={e => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    const createStatusOption = status => ({
        value: status,
        label: getCandidateStatusText(status),
    });

    const statusOptions = [
        createStatusOption(CandidateStatus.NEW),
        createStatusOption(CandidateStatus.INTERVIEWING),
        createStatusOption(CandidateStatus.HIRE),
        createStatusOption(CandidateStatus.NO_HIRE),
    ];

    const onRowClicked = record => {
        history.push(routeCandidateDetails(record.candidateId));
    };

    const onStatusFilterClear = () => {
        setFilter({
            ...filter,
            status: null,
        });
    };

    const onStatusFilterChange = value => {
        setFilter({
            ...filter,
            status: value,
        });
    };

    const onDisplayArchivedChange = e => {
        setFilter({
            ...filter,
            displayArchived: e.target.checked,
        });
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <Title level={4} style={{ marginBottom: 20 }}>
                Candidates
            </Title>

            <div className={styles.divRight}>
                <Checkbox className={styles.checkbox} onChange={onDisplayArchivedChange} defaultChecked>
                    Display archived
                </Checkbox>
                <Select
                    className={styles.select}
                    placeholder='Status filter'
                    options={statusOptions}
                    onSelect={onStatusFilterChange}
                    onClear={onStatusFilterClear}
                    showSearch
                    allowClear
                    filterOption={filterOptionLabel}
                />
            </div>

            <Card withPadding={false}>
                <Table
                    pagination={{
                        style: { marginRight: 24 },
                        defaultPageSize: 20,
                    }}
                    scroll={{
                        x: "max-content",
                    }}
                    columns={columns}
                    dataSource={candidates}
                    loading={loading && candidates.length === 0}
                    rowClassName={styles.row}
                    onRow={record => ({
                        onClick: () => onRowClicked(record),
                    })}
                />
            </Card>
        </Layout>
    );
};

const mapDispatch = { loadCandidates, updateCandidate, deleteCandidate };

const mapState = state => {
    const candidatesState = state.candidates || {};

    return {
        candidatesData: orderBy(candidatesState.candidates, "createdDate", ["desc"]),
        loading: candidatesState.loading,
    };
};

export default connect(mapState, mapDispatch)(Candidates);

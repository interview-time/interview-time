import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import { Button, Dropdown, Menu, Modal, Input, Table } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import { localeCompare } from "../../utils/comparators";
import TableText from "../../components/table/table-text";
import Title from "antd/lib/typography/Title";
import TableHeader from "../../components/table/table-header";
import { deleteCandidate, updateCandidate } from "../../store/candidates/actions";
import { canAddCandidate } from "../../store/user/permissions";
import { loadCandidates } from "../../store/candidates/actions";
import { selectCandidates, filterCandidates, searchCandidates } from "../../store/candidates/selector";
import CandidateStatusTag from "../../components/tags/candidate-status-tag";
import styles from "./candidates.module.css";
import { routeCandidates, routeCandidateProfile } from "../../utils/route";
import { useHistory } from "react-router-dom";
import ArchivedTag from "../../components/tags/candidate-archived-tag";
import { CandidatesFilter } from "../../utils/constants";
import { MoreIcon } from "../../utils/icons";
import { cloneDeep } from "lodash/lang";
import { getFormattedDateShort } from "../../utils/date-fns";
import Filter from "../../components/filter/filter";
import CreateCandidate from "../candidate-profile/create-candidate";

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
const Candidates = ({ candidatesData, loading, loadCandidates, updateCandidate, deleteCandidate, canAddCandidate }) => {
    const history = useHistory();

    const [candidates, setCandidates] = useState([]);
    const [filter, setFilter] = useState(CandidatesFilter.Current);
    const [searchQuery, setSearchQuery] = useState();
    const [createCandidate, setCreateCandidate] = useState(false);

    React.useEffect(() => {
        loadCandidates();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let filteredCandidates = candidatesData;

        if (filter !== CandidatesFilter.All) {
            filteredCandidates = filterCandidates(candidatesData, filter);
        }

        if (searchQuery) {
            filteredCandidates = searchCandidates(filteredCandidates, searchQuery);
        }

        setCandidates(filteredCandidates);
    }, [candidatesData, filter, searchQuery]);

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
            render: candidate => <TableText>{getFormattedDateShort(candidate.createdDate, "-")}</TableText>,
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

    const onRowClicked = record => {
        history.push(routeCandidateProfile(record.candidateId));
    };

    return (
        <Layout contentStyle={styles.rootContainer}>
            <div className={styles.header}>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Candidates
                </Title>
                {canAddCandidate && (
                    <Button type='primary' icon={<UserAddOutlined />} onClick={() => setCreateCandidate(true)}>
                        Add Candidate
                    </Button>
                )}
            </div>

            <div className={styles.controls}>
                <Filter
                    filters={[CandidatesFilter.All, CandidatesFilter.Current, CandidatesFilter.Archived]}
                    initActive={CandidatesFilter.Current}
                    onClick={filter => setFilter(filter)}
                />

                <Input
                    className={styles.search}
                    allowClear
                    placeholder='Search name or position'
                    prefix={<SearchOutlined className={styles.searchIcon} />}
                    onChange={e => setSearchQuery(e.target.value)}
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

            <Modal
                title='Schedule Interview'
                visible={createCandidate}
                centered={true}
                width={600}
                onCancel={() => setCreateCandidate(false)}
                footer={null}
            >
                <CreateCandidate onSave={() => setCreateCandidate(false)} onCancel={() => setCreateCandidate(false)} />
            </Modal>
        </Layout>
    );
};

const mapDispatch = { loadCandidates, updateCandidate, deleteCandidate };

const mapState = state => {
    return {
        candidatesData: selectCandidates(state),
        loading: state.candidates.loading,
        error: state.candidates.error,
        canAddCandidate: canAddCandidate(state),
    };
};

export default connect(mapState, mapDispatch)(Candidates);

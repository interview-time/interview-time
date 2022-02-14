import React from "react";
import Layout from "../../components/layout/layout";
import { Table } from "antd";
import Card from "../../components/card/card";
import { connect } from "react-redux";
import { localeCompare } from "../../components/utils/comparators";
import TableText from "../../components/table/table-text";
import { orderBy } from "lodash/collection";
import Title from "antd/lib/typography/Title";
import { getFormattedDateSimple } from "../../components/utils/utils";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import TableHeader from "../../components/table/table-header";
import { loadCandidates } from "../../store/candidates/actions";
import CandidateStatusTag from "../../components/tags/candidate-status-tag";
import styles from "./candidates.module.css";

const Candidates = ({ loadCandidates, candidates, loading }) => {
    React.useEffect(() => {
        loadCandidates();
        // eslint-disable-next-line
    }, []);

    const iconStyle = { fontSize: 20, color: "#374151" };

    const columns = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidateName",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.candidateName, b.candidateName),
            render: candidate => <TableText className={`fs-mask`}>{candidate.candidateName}</TableText>,
        },
        {
            title: <TableHeader>SOCIALS</TableHeader>,
            key: "linkedin",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.linkedin, b.linkedin),
            render: candidate => (
                <>
                    {candidate.linkedIn && candidate.linkedIn.includes("linkedin.com/") && (
                        <a href={candidate.linkedIn} target='_blank' rel='noreferrer'>
                            <LinkedinFilled style={iconStyle} />
                        </a>
                    )}{" "}
                    {candidate.gitHub && candidate.gitHub.includes("github.com/") && (
                        <a href={candidate.gitHub} target='_blank' rel='noreferrer'>
                            <GithubFilled style={iconStyle} />
                        </a>
                    )}
                </>
            ),
        },
        {
            title: <TableHeader>CREATED DATE</TableHeader>,
            key: "createdDate",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.createdDate, b.createdDate),
            render: candidate => (
                <TableText className={`fs-mask`}>{getFormattedDateSimple(candidate.createdDate, "-")}</TableText>
            ),
        },
        {
            title: <TableHeader>INTERVIEWS</TableHeader>,
            key: "interviews",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.interviews, b.interviews),
            render: candidate => <TableText className={`fs-mask`}>{candidate.totalInterviews}</TableText>,
        },
        {
            title: <TableHeader>STATUS</TableHeader>,
            key: "status",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) => localeCompare(a.status, b.status),
            render: candidate => <CandidateStatusTag status={candidate.status} />,
        },
    ];

    return (
        <Layout contentStyle={styles.rootContainer}>
            <Title level={4} style={{ marginBottom: 20 }}>
                Candidates
            </Title>

            <Card withPadding={false}>
                <Table
                    pagination={false}
                    scroll={{
                        x: "max-content",
                    }}
                    columns={columns}
                    dataSource={candidates}
                    loading={loading}
                    rowClassName={styles.row}
                />
            </Card>
        </Layout>
    );
};

const mapDispatch = { loadCandidates };

const mapState = state => {
    const candidatesState = state.candidates || {};

    return {
        candidates: orderBy(candidatesState.candidates, "status", ["asc"]),
        loading: candidatesState.loading,
    };
};

export default connect(mapState, mapDispatch)(Candidates);

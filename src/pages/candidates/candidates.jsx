import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../components/layout/layout";
import { loadInterviews } from "../../store/interviews/actions";
import styles from "./candidates.module.css";
import { Card, Col, Input, Popover, Row, Select, Space, Table, Tag } from 'antd';
import { connect } from "react-redux";
import moment from "moment";
import { sortBy } from "lodash/collection";
import {
    getStatusText,
    Status
} from "../../components/utils/constants";
import {
    getGroupAssessmentColor,
    getDecisionColor,
    getDecisionText,
    getGroupAssessmentText,
    getOverallPerformancePercent,
} from "../../components/utils/assessment";
import { localeCompare } from "../../components/utils/comparators";
import { reverse, sortedUniq } from "lodash/array";
import { cloneDeep } from "lodash/lang";
import { routeInterviewScorecard } from "../../components/utils/route";
import { TrophyTwoTone } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";

const { Search } = Input;

const TOP_PERFORMANCE = 80;
const Candidates = ({ interviews, loading, loadInterviews }) => {

    const history = useHistory();
    const [interviewsData, setInterviews] = useState([])
    const [position, setPosition] = useState()

    React.useEffect(() => {
        loadInterviews();
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setInterviews(interviews)
        // eslint-disable-next-line
    }, [interviews]);

    React.useEffect(() => {
        if (position) {
            let lowerCaseText = position.toLocaleLowerCase()
            setInterviews(interviews.filter(interview =>
                interview.position.toLocaleLowerCase().includes(lowerCaseText))
            )
        } else if (position === null) {
            setInterviews(interviews)
        }
        // eslint-disable-next-line
    }, [position]);

    const onRowClicked = (record) => {
        history.push(routeInterviewScorecard(record.interviewId));
    }

    const onSearchTextChanged = e => {
        onSearchClicked(e.target.value)
    };

    const onSearchClicked = text => {
        let lowerCaseText = text.toLocaleLowerCase()
        setInterviews(interviews.filter(item =>
            item.candidate.toLocaleLowerCase().includes(lowerCaseText)
            || item.position.toLocaleLowerCase().includes(lowerCaseText)
            || moment(item.interviewDateTime).format('lll').toLocaleLowerCase().includes(lowerCaseText)
            || getStatusText(item.status).toLocaleLowerCase().includes(lowerCaseText)
            || getDecisionText(item.decision).toLocaleLowerCase().includes(lowerCaseText)
        ))
    };

    const onPositionClear = () => {
        setPosition(null)
    }

    const onPositionChange = value => {
        setPosition(value)
    }

    const columns = [
        {
            title: 'Candidate Name',
            key: 'candidate',
            dataIndex: 'candidate',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => localeCompare(a.candidate, b.candidate),
        },
        {
            title: 'Position',
            key: 'position',
            dataIndex: 'position',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => localeCompare(a.position, b.position),
        },
        {
            title: 'Performance',
            key: 'position',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => getOverallPerformancePercent(a.structure.groups) - getOverallPerformancePercent(b.structure.groups),
            render: interview => {
                const overallPerformance = getOverallPerformancePercent(interview.structure.groups);

                return <Space>
                    {overallPerformance + '%'}
                    {overallPerformance >= TOP_PERFORMANCE &&
                    <TrophyTwoTone style={{ fontSize: 16 }} twoToneColor='#faad14' />}
                </Space>;
            }
        },
        {
            title: 'Competence Areas',
            key: 'status',
            render: interview => <Popover title="Competence Areas" content={
                <Space direction="vertical" className={styles.assessmentPopup}>
                    {interview.structure.groups.map(group => {
                        let color = getGroupAssessmentColor(group)
                        return <Row gutter={16}>
                            <Col span={12}>{group.name}</Col>
                            <Col span={12}>
                                <span className={styles.dotSmall} style={{ backgroundColor: color }} />
                                <span>{getGroupAssessmentText(group)}</span>
                            </Col>
                        </Row>
                    })}
                </Space>
            }><Space>
                {
                    interview.structure.groups.map(group => {
                        let color = getGroupAssessmentColor(group)
                        return <span className={styles.dot} style={{ backgroundColor: color }} />
                    })
                }
            </Space></Popover>,
        },
        {
            title: 'Recommendation',
            key: 'decision',
            dataIndex: 'decision',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => localeCompare(a.decision, b.decision),
            render: decision => (
                <>
                    {<Tag color={getDecisionColor(decision)} key={decision}>
                        {getDecisionText(decision)}
                    </Tag>}
                </>
            ),
        }
    ];

    return (
        <Layout>
            <Col span={24} xl={{ span: 18, offset: 3 }} xxl={{ span: 14, offset: 5 }}>

                <div className={styles.header}>
                    <Title level={2}>Reports</Title>
                    <span className={styles.subTitle}>
                        Compare multiple candidates and focus on the best person for the role
                    </span>
                </div>

                <div className={styles.divSpaceBetween}>
                    <Search placeholder="Search" key="search" className={styles.headerSearch} allowClear
                            onSearch={onSearchClicked} onChange={onSearchTextChanged} />
                    <Space>
                        <Text>Filter</Text>
                        <Select
                            className={styles.select}
                            placeholder="Position"
                            onSelect={onPositionChange}
                            onClear={onPositionClear}
                            options={
                                sortedUniq(interviews.map(interview => interview.position)).map(position => {
                                    return {
                                        label: position,
                                        value: position,
                                    }
                                })
                            }
                            showSearch
                            allowClear
                            filterOption={(inputValue, option) =>
                                option.value.toLocaleLowerCase().includes(inputValue)
                            }
                        />
                    </Space>
                </div>

                <Card bodyStyle={{ padding: 0 }}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={interviewsData}
                        loading={loading}
                        rowClassName={styles.row}
                        onRow={(record) => ({
                            onClick: () => onRowClicked(record),
                        })}
                    />
                </Card>
            </Col>
        </Layout>
    )
}

const mapDispatch = { loadInterviews };
const mapState = (state) => {
    const interviewsState = state.interviews || {};

    const interviews = reverse(sortBy(cloneDeep(
        interviewsState.interviews.filter(interview => interview.status === Status.COMPLETED)
    ), ['interviewDateTime']))

    return {
        interviews: interviews,
        loading: interviewsState.loading
    }
}

export default connect(mapState, mapDispatch)(Candidates)
import Layout from "../../components/layout/layout";
import JobCard from "./job-card";
import { Button, Input, List, Space, Typography } from "antd";
import { Job } from "../../store/models";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Filter, Plus, Search, SortDesc } from "lucide-react";
import React from "react";
import { useDebounceFn } from "ahooks";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import { useHistory } from "react-router-dom";
import { routeJobsNew } from "../../utils/route";

const { Title } = Typography;

const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 16px 32px;
    background-color: ${Colors.White};
    border-bottom: 1px solid ${Colors.Neutral_200};
    display: flex;
    justify-content: space-between;
`;

const HeaderSearch = styled(Input)`
    width: 280px;
    border-radius: 6px;
`;

const Jobs = () => {

    const history = useHistory();

    const jobsData: Job[] = [];
    for (let i = 0; i < 20; i++) {
        jobsData.push({
            jobId: "id" + i,
            title: "Software Engineer " + i,
            department: "Technical",
            location: "Mountain View, CA",
            createdDate: "2022-07-13T11:15:00Z",
            totalCandidates: i * 10,
            newlyAddedCandidates: i,
            pipeline: []
        });
    }

    const [jobs, setJobs] = React.useState(jobsData);

    const onSearchTextChangeDebounce = useDebounceFn(
        (text: string) => {
            setJobs(jobsData.filter(job => job.title.toLowerCase().includes(text.toLowerCase())));
        },
        {
            wait: 500,
            maxWait: 2000,
        }
    );

    const onSearchTextChange = (text: string) => onSearchTextChangeDebounce.run(text);

    const onAddJobClicked = () => history.push(routeJobsNew());

    const header = (
        <Header>
            <Space size={16}>
                <HeaderSearch
                    allowClear
                    placeholder='Search for job'
                    prefix={<Search size={18} color={Colors.Neutral_400} />}
                    onChange={e => onSearchTextChange(e.target.value)}
                />
                <Button
                    icon={
                        <AntIconSpan>
                            <Filter size='1em' />
                        </AntIconSpan>
                    }
                >
                    Filter
                </Button>
                <Button
                    icon={
                        <AntIconSpan>
                            <SortDesc size='1em' />
                        </AntIconSpan>
                    }
                >
                    Sort
                </Button>
            </Space>
            <Button
                type='primary'
                icon={
                    <AntIconSpan>
                        <Plus size='1em' />
                    </AntIconSpan>
                }
                onClick={onAddJobClicked}
            >
                Create new job
            </Button>
        </Header>
    );

    return (
        <Layout header={header}>
            <Title level={3}>Jobs</Title>
            <List
                grid={{ gutter: 24, column: 1 }}
                split={false}
                dataSource={jobs}
                pagination={{
                    defaultPageSize: 8,
                    hideOnSinglePage: true,
                }}
                renderItem={(job: Job) => (
                    <List.Item>
                        <JobCard job={job} />
                    </List.Item>
                )}
            />
        </Layout>
    );
};

export default Jobs;

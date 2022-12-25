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
import NewEntryImage from "../../assets/illustrations/undraw_new_entries.svg";
import { useHistory } from "react-router-dom";
import { routeJobsNew } from "../../utils/route";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { SecondaryText } from "../job-new/styles";
import { fetchJobs } from "../../store/jobs/actions";
import { selectGetJobsStatus, selectJobs } from "../../store/jobs/selectors";

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

const PlaceholderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 64px;
`;

const PlaceholderText = styled(SecondaryText)`
    max-width: 300px;
    margin-top: 24px;
    text-align: center;
`;

// TODO add filter and sorting
// TODO add actions to job card

const Jobs = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const jobsOriginal: Job[] = useSelector(selectJobs, shallowEqual);
    const [jobs, setJobs] = React.useState<Job[]>([]);

    const loading = useSelector(selectGetJobsStatus, shallowEqual) === ApiRequestStatus.InProgress;

    React.useEffect(() => {
        setJobs(jobsOriginal);
        // eslint-disable-next-line
    }, [jobsOriginal]);

    React.useEffect(() => {
        dispatch(fetchJobs());
        // eslint-disable-next-line
    }, []);

    const onSearchTextChangeDebounce = useDebounceFn(
        (text: string) => {
            setJobs(jobsOriginal.filter(job => job.title.toLowerCase().includes(text.toLowerCase())));
        },
        {
            wait: 500,
            maxWait: 2000,
        }
    );

    const onSearchTextChange = (text: string) => onSearchTextChangeDebounce.run(text);

    const onAddJobClicked = () => history.push(routeJobsNew());

    const HeaderComponent = (
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

    const PlaceholderComponent = (
        <PlaceholderContainer>
            <img src={NewEntryImage} width={200} alt='No jobs' />
            <PlaceholderText>{jobsOriginal.length === 0 ? "You don't have any jobs" : "No jobs found"}</PlaceholderText>
        </PlaceholderContainer>
    );

    return (
        <Layout header={HeaderComponent}>
            {jobs.length === 0 && PlaceholderComponent}
            {jobs.length > 0 && (
                <>
                    <Title level={3}>Jobs</Title>
                    <List
                        grid={{ gutter: 24, column: 1 }}
                        split={false}
                        dataSource={jobs}
                        pagination={{
                            defaultPageSize: 8,
                            hideOnSinglePage: true,
                        }}
                        loading={loading}
                        renderItem={(job: Job) => (
                            <List.Item>
                                <JobCard job={job} />
                            </List.Item>
                        )}
                    />
                </>
            )}
        </Layout>
    );
};

export default Jobs;

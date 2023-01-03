import Layout from "../../components/layout/layout";
import JobCard from "./job-card";
import { Button, Input, List, Space, Spin, Typography } from "antd";
import { Job } from "../../store/models";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { Filter, Plus, Search, SortDesc } from "lucide-react";
import React from "react";
import { useDebounceFn } from "ahooks";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import NewEntryImage from "../../assets/illustrations/undraw_new_entries.svg";
import { useHistory } from "react-router-dom";
import { routeJobDetails, routeJobEdit, routeJobsNew } from "../../utils/route";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ApiRequestStatus } from "../../store/state-models";
import { fetchJobs } from "../../store/jobs/actions";
import { selectGetJobsStatus, selectJobs } from "../../store/jobs/selectors";
import { SecondaryText } from "../../assets/styles/global-styles";

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

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
`;

// TODO add filter and sorting

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
        dispatch(fetchJobs(true));
        // eslint-disable-next-line
    }, []);

    const onSearchTextChangeDebounce = useDebounceFn(
        (text: string) => {
            setJobs(jobsOriginal.filter(job => job.title.toLowerCase().includes(text.toLowerCase())));
        },
        {
            wait: 250,
            maxWait: 1000,
        }
    );

    const onSearchTextChange = (text: string) => onSearchTextChangeDebounce.run(text);

    const onAddJobClicked = () => history.push(routeJobsNew());

    const onJobCardClicked = (job: Job) => history.push(routeJobDetails(job.jobId));

    const onEditJobClicked = (job: Job) => history.push(routeJobEdit(job.jobId));

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

    const Placeholder = () => {
        let placeholderText = "No jobs found"; // filter applied
        if (loading) {
            placeholderText = "Loading jobs...";
        } else if (jobsOriginal.length === 0) {
            placeholderText = "You don't have any jobs";
        }

        return (
            <PlaceholderContainer>
                <img src={NewEntryImage} width={200} alt={placeholderText} />
                <PlaceholderText>{placeholderText}</PlaceholderText>
            </PlaceholderContainer>
        );
    };

    return (
        <Layout header={HeaderComponent}>
            {jobs.length === 0 && Placeholder()}
            {jobs.length > 0 && (
                <>
                    <TitleContainer>
                        <Title level={4} style={{ marginBottom: 0 }}>
                            Jobs
                        </Title>
                        <Spin spinning={loading} />
                    </TitleContainer>
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
                                <JobCard job={job} onCardClicked={onJobCardClicked} onEditClicked={onEditJobClicked} />
                            </List.Item>
                        )}
                    />
                </>
            )}
        </Layout>
    );
};

export default Jobs;

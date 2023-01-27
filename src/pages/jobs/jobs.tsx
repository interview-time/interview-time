import { Button, ConfigProvider, List, Select, Space, Spin, Typography } from "antd";
import { Option } from "antd/lib/mentions";
import { Plus } from "lucide-react";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { FormLabelSmall } from "../../assets/styles/global-styles";
import AntIconSpan from "../../components/buttons/ant-icon-span";
import EmptyState from "../../components/empty-state/empty-state";
import Layout from "../../components/layout/layout";
import {
    FilterButton,
    Header,
    HeaderContainer,
    HeaderSearch,
    SearchButton,
} from "../../components/layout/layout-header";
import { fetchJobs } from "../../store/jobs/actions";
import { selectDepartments, selectGetJobsStatus, selectJobs } from "../../store/jobs/selectors";
import { Job, JobStatus, TeamMember } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { selectTeamMembers } from "../../store/team/selector";
import { filterOptionLabel } from "../../utils/filters";
import { routeJobDetails, routeJobEdit, routeJobsNew } from "../../utils/route";
import {
    getJobFilterFromStorage,
    getJobSortFromStorage,
    setJobFilterToStorage,
    setJobSortToStorage,
} from "../../utils/storage";
import JobCard from "./job-card";

const { Title } = Typography;

const HeaderMetaContainer = styled.div`
    display: flex;
    gap: 16px;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
`;

export type Filter = {
    search: string;
    status?: JobStatus;
    department?: string;
    ownerId?: string;
};

export type Sort = {
    title?: SortOrder;
    createdDate?: SortOrder;
};

enum SortOrder {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING",
}

type HeaderMeta = {
    filterOpen: boolean;
    sortOpen: boolean;
};

const Jobs = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [headerMeta, setHeaderMeta] = React.useState<HeaderMeta>({
        filterOpen: false,
        sortOpen: false,
    });
    const [filter, setFilter] = React.useState<Filter>(
        getJobFilterFromStorage() || {
            search: "",
            status: undefined,
            department: undefined,
            ownerId: undefined,
        }
    );
    const [sort, setSort] = React.useState<Sort>(
        getJobSortFromStorage() || {
            title: undefined,
            createdDate: undefined,
        }
    );

    const jobsOriginal: Job[] = useSelector(selectJobs, shallowEqual);
    const departments: string[] = useSelector(selectDepartments, shallowEqual);
    const teamMembers: TeamMember[] = useSelector(selectTeamMembers, shallowEqual);
    const loading = useSelector(selectGetJobsStatus, shallowEqual) === ApiRequestStatus.InProgress;

    const departmentOptions = departments.map(department => ({
        label: department,
        value: department,
    }));
    const teamMembersOptions = teamMembers.map(teamMember => ({
        label: teamMember.name,
        value: teamMember.userId,
    }));

    React.useEffect(() => {
        updateJobs();
        saveSortToStorage();
        saveFilterToStorage();
        // eslint-disable-next-line
    }, [jobsOriginal, filter, sort]);

    React.useEffect(() => {
        dispatch(fetchJobs(true));
        // eslint-disable-next-line
    }, []);

    const updateJobs = () => {
        let jobs = [...jobsOriginal];

        if (filter.status) {
            jobs = jobs.filter(job => job.status === filter.status);
        }

        if (filter.department) {
            jobs = jobs.filter(job => job.department === filter.department);
        }

        if (filter.ownerId) {
            jobs = jobs.filter(job => job.owner === filter.ownerId);
        }

        if (filter.search) {
            jobs = jobs.filter(job => job.title.toLowerCase().includes(filter.search.toLowerCase()));
        }

        if (sort.title) {
            jobs = jobs.sort((a, b) =>
                sort.title === SortOrder.ASCENDING ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
            );
        }

        if (sort.createdDate) {
            jobs = jobs.sort((a, b) =>
                sort.createdDate === SortOrder.ASCENDING
                    ? new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                    : new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
            );
        }

        setJobs(jobs);
    };

    const saveFilterToStorage = () => {
        if (filter.ownerId || filter.status || filter.department || filter.search.length > 0) {
            setJobFilterToStorage(filter);
        } else {
            setJobFilterToStorage(undefined);
        }
    };

    const saveSortToStorage = () => {
        if (sort.title || sort.createdDate) {
            setJobSortToStorage(sort);
        } else {
            setJobSortToStorage(undefined);
        }
    };

    const onTitleSortChange = (sortOrder?: SortOrder) =>
        setSort({
            ...sort,
            title: sortOrder,
        });

    const onDateSortChange = (sortOrder?: SortOrder) =>
        setSort({
            ...sort,
            createdDate: sortOrder,
        });

    const onStatusFilterChange = (status?: JobStatus) =>
        setFilter({
            ...filter,
            status: status,
        });

    const onDepartmentFilterChange = (department?: string) =>
        setFilter({
            ...filter,
            department: department,
        });

    const onOwnerFilterChange = (ownerId?: string) =>
        setFilter({
            ...filter,
            ownerId: ownerId,
        });

    const getFilterCount = () => {
        let count = 0;
        if (filter.status) {
            count++;
        }
        if (filter.department) {
            count++;
        }
        if (filter.ownerId) {
            count++;
        }
        return count;
    };

    const getSortCount = () => {
        let count = 0;
        if (sort.title) {
            count++;
        }
        if (sort.createdDate) {
            count++;
        }
        return count;
    };

    const onSearchTextChange = (text: string) =>
        setFilter({
            ...filter,
            search: text,
        });

    const onAddJobClicked = () => history.push(routeJobsNew());

    const onJobCardClicked = (job: Job) => history.push(routeJobDetails(job.jobId));

    const onEditJobClicked = (job: Job) => history.push(routeJobEdit(job.jobId));

    const getSortContainer = (
        <HeaderMetaContainer>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Title</FormLabelSmall>
                <Select
                    allowClear
                    style={{ minWidth: 160 }}
                    defaultValue={sort.title}
                    placeholder='None'
                    onSelect={onTitleSortChange}
                    onClear={() => onTitleSortChange(undefined)}
                >
                    <Option value={SortOrder.ASCENDING}>Sort Ascending</Option>
                    <Option value={SortOrder.DESCENDING}>Sort Descending</Option>
                </Select>
            </Space>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Created Date</FormLabelSmall>
                <Select
                    allowClear
                    style={{ minWidth: 160 }}
                    defaultValue={sort.createdDate}
                    placeholder='None'
                    onSelect={onDateSortChange}
                    onClear={() => onDateSortChange(undefined)}
                >
                    <Option value={SortOrder.ASCENDING}>Newest First</Option>
                    <Option value={SortOrder.DESCENDING}>Oldest First</Option>
                </Select>
            </Space>
        </HeaderMetaContainer>
    );

    const getFilterContainer = (
        <HeaderMetaContainer>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Department</FormLabelSmall>
                <Select
                    allowClear
                    showSearch
                    style={{ minWidth: 200 }}
                    defaultValue={filter.department}
                    placeholder='All'
                    options={departmentOptions}
                    filterOption={filterOptionLabel}
                    onSelect={onDepartmentFilterChange}
                    onClear={() => onDepartmentFilterChange(undefined)}
                />
            </Space>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Owner</FormLabelSmall>
                <Select
                    allowClear
                    showSearch
                    style={{ minWidth: 200 }}
                    defaultValue={filter.ownerId}
                    placeholder='Everyone'
                    options={teamMembersOptions}
                    filterOption={filterOptionLabel}
                    onSelect={onOwnerFilterChange}
                    onClear={() => onOwnerFilterChange(undefined)}
                />
            </Space>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Status</FormLabelSmall>
                <Select
                    allowClear
                    style={{ minWidth: 140 }}
                    defaultValue={filter.status}
                    placeholder='All'
                    onSelect={onStatusFilterChange}
                    onClear={() => onStatusFilterChange(undefined)}
                >
                    <Option value={JobStatus.OPEN}>Open</Option>
                    <Option value={JobStatus.CLOSED}>Closed</Option>
                </Select>
            </Space>
        </HeaderMetaContainer>
    );

    const getHeaderContainer = (
        <HeaderContainer>
            <Header>
                <Space size={16}>
                    <HeaderSearch
                        placeholder='Search for job'
                        defaultValue={filter.search}
                        onSearchTextChange={onSearchTextChange}
                    />
                    <FilterButton
                        count={getFilterCount()}
                        open={headerMeta.filterOpen}
                        onClick={() => {
                            setHeaderMeta({
                                filterOpen: !headerMeta.filterOpen,
                                sortOpen: false,
                            });
                        }}
                    />
                    <SearchButton
                        count={getSortCount()}
                        open={headerMeta.sortOpen}
                        onClick={() => {
                            setHeaderMeta({
                                filterOpen: false,
                                sortOpen: !headerMeta.sortOpen,
                            });
                        }}
                    />
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
            {headerMeta.filterOpen && getFilterContainer}
            {headerMeta.sortOpen && getSortContainer}
        </HeaderContainer>
    );

    return (
        <Layout header={getHeaderContainer}>
            <ConfigProvider renderEmpty={() => <EmptyState message='You currently don’t have any jos.' />}>
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
            </ConfigProvider>
        </Layout>
    );
};

export default Jobs;

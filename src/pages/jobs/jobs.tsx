import Layout from "../../components/layout/layout";
import JobCard from "./job-card";
import { Button, Input, List, Select, Space, Spin, Typography } from "antd";
import { Job, JobStatus, TeamMember } from "../../store/models";
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
import { selectDepartments, selectGetJobsStatus, selectJobs } from "../../store/jobs/selectors";
import { FormLabelSmall, SecondaryText, TagNumber } from "../../assets/styles/global-styles";
import { Option } from "antd/lib/mentions";
import { filterOptionLabel } from "../../utils/filters";
import { selectTeamMembers } from "../../store/team/selector";
import {
    getJobFilterFromStorage,
    getJobSortFromStorage,
    setJobFilterToStorage,
    setJobSortToStorage
} from "../../utils/storage";

const { Title } = Typography;

const HeaderContainer = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    width: 100%;
    padding: 16px 32px;
    gap: 16px;
    background-color: ${Colors.White};
    border-bottom: 1px solid ${Colors.Neutral_200};
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HeaderMeta = styled.div`
    display: flex;
    gap: 16px;
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

const FilterIndicator = styled(TagNumber)`
    margin-left: 8px;
`;

type FilterButtonProps = {
    borderColor: string;
};

const BorderedButton = styled(Button)`
    border-color: ${(props: FilterButtonProps) => props.borderColor};
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
            // TODO add owner filter when backend will return ownerId
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

    const onSearchTextChangeDebounce = useDebounceFn(
        (text: string) => {
            setFilter({
                ...filter,
                search: text,
            });
        },
        {
            wait: 250,
            maxWait: 1000,
        }
    );

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

    const onSearchTextChange = (text: string) => onSearchTextChangeDebounce.run(text);

    const onAddJobClicked = () => history.push(routeJobsNew());

    const onJobCardClicked = (job: Job) => history.push(routeJobDetails(job.jobId));

    const onEditJobClicked = (job: Job) => history.push(routeJobEdit(job.jobId));

    const getSortContainer = (
        <HeaderMeta>
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
        </HeaderMeta>
    );

    const getFilterContainer = (
        <HeaderMeta>
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
                    defaultValue={filter.department}
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
        </HeaderMeta>
    );

    const getHeaderContainer = (
        <HeaderContainer>
            <Header>
                <Space size={16}>
                    <HeaderSearch
                        allowClear
                        placeholder='Search for job'
                        defaultValue={filter.search}
                        prefix={<Search size={18} color={Colors.Neutral_400} />}
                        onChange={e => onSearchTextChange(e.target.value)}
                    />
                    <BorderedButton
                        icon={
                            <AntIconSpan>
                                <Filter size='1em' />
                            </AntIconSpan>
                        }
                        onClick={() =>
                            setHeaderMeta({
                                filterOpen: !headerMeta.filterOpen,
                                sortOpen: false,
                            })
                        }
                        borderColor={headerMeta.filterOpen ? Colors.Primary_500 : Colors.Neutral_200}
                    >
                        Filter {getFilterCount() !== 0 && <FilterIndicator>{getFilterCount()}</FilterIndicator>}
                    </BorderedButton>
                    <BorderedButton
                        icon={
                            <AntIconSpan>
                                <SortDesc size='1em' />
                            </AntIconSpan>
                        }
                        onClick={() =>
                            setHeaderMeta({
                                filterOpen: false,
                                sortOpen: !headerMeta.sortOpen,
                            })
                        }
                        borderColor={headerMeta.sortOpen ? Colors.Primary_500 : Colors.Neutral_200}
                    >
                        Sort {getSortCount() !== 0 && <FilterIndicator>{getSortCount()}</FilterIndicator>}
                    </BorderedButton>
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

    const getPlaceholder = () => {
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
        <Layout header={getHeaderContainer}>
            {jobs.length === 0 && getPlaceholder()}
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

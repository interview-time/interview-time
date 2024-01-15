import { Button, ConfigProvider, Dropdown, Select, Space, Spin, Table, Typography } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { Option } from "antd/lib/mentions";
import { ColumnsType } from "antd/lib/table/interface";
import { MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Card, FormLabelSmall, Tag } from "../../assets/styles/global-styles";
import InitialsAvatar from "../../components/avatar/initials-avatar";
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
import TableHeader from "../../components/table/table-header";
import { archiveCandidate, loadCandidates, restoreArchivedCandidate } from "../../store/candidates/actions";
import {
    CandidateStatus,
    filterCandidates,
    selectCandidates,
    selectGetCandidatesStatus,
    sortCandidatesByCreatedDate,
} from "../../store/candidates/selector";
import { Candidate, CandidateDetails } from "../../store/models";
import { ApiRequestStatus } from "../../store/state-models";
import { canAddCandidate } from "../../store/user/permissions";
import { getFormattedDateShort } from "../../utils/date-fns";
import { filterOptionLabel } from "../../utils/filters";
import { routeCandidateProfile } from "../../utils/route";
import CreateCandidateModal from "../candidate-add/create-candidate-modal";
import styles from "./candidates.module.css";

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

const ActionsButton = styled(Button)`
    && {
        width: 36px;
        height: 36px;
    }
`;

type HeaderMeta = {
    filterOpen: boolean;
    sortOpen: boolean;
};

export type Filter = {
    search: string;
    jobTitle?: string;
    candidateStatus: CandidateStatus;
};

export type Sort = {
    name?: SortOrder;
    createdDate?: SortOrder;
};

enum SortOrder {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING",
}

const Candidates = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const addCandidateButtonVisible: boolean = useSelector(canAddCandidate, shallowEqual);
    const candidatesOriginal: Candidate[] = useSelector(selectCandidates, shallowEqual);
    const getCandidatesStatus: ApiRequestStatus = useSelector(selectGetCandidatesStatus, shallowEqual);
    const candidatesLoading = getCandidatesStatus === ApiRequestStatus.InProgress;

    const [headerMeta, setHeaderMeta] = useState<HeaderMeta>({
        filterOpen: false,
        sortOpen: false,
    });
    const [filter, setFilter] = useState<Filter>({ search: "", candidateStatus: CandidateStatus.Current });
    const [sort, setSort] = useState<Sort>({ name: undefined, createdDate: undefined });
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [addCandidateVisible, setAddCandidateVisible] = useState(false);

    const candidateStatusOptions = [
        { label: CandidateStatus.All, value: CandidateStatus.All },
        { label: CandidateStatus.Current, value: CandidateStatus.Current },
        { label: CandidateStatus.Archived, value: CandidateStatus.Archived },
    ];

    useEffect(() => {
        updateCandidates();
        // eslint-disable-next-line
    }, [candidatesOriginal, filter, sort]);

    useEffect(() => {
        dispatch(loadCandidates(true));
        // eslint-disable-next-line
    }, []);

    const updateCandidates = () => {
        let candidates = [...candidatesOriginal];

        candidates = filterCandidates(candidates, filter.candidateStatus);

        if (filter.search) {
            candidates = candidates.filter(candidate =>
                candidate.candidateName.toLowerCase().includes(filter.search.toLowerCase())
            );
        }

        if (sort.name) {
            candidates = candidates.sort((a, b) =>
                sort.name === SortOrder.ASCENDING
                    ? a.candidateName.localeCompare(b.candidateName)
                    : b.candidateName.localeCompare(a.candidateName)
            );
        }

        if (sort.createdDate) {
            candidates = sortCandidatesByCreatedDate(candidates, sort.createdDate === SortOrder.ASCENDING);
        }

        setCandidates(candidates);
    };

    const onSearchTextChange = (text: string) => {
        setFilter({
            ...filter,
            search: text,
        });
    };

    const onStatusFilterChange = (status: CandidateStatus) =>
        setFilter({
            ...filter,
            candidateStatus: status,
        });

    const onNameSortChange = (sortOrder?: SortOrder) =>
        setSort({
            ...sort,
            name: sortOrder,
        });

    const onDateSortChange = (sortOrder?: SortOrder) =>
        setSort({
            ...sort,
            createdDate: sortOrder,
        });

    const onAddCandidate = () => setAddCandidateVisible(true);

    const onCandidateClicked = (candidate: Candidate) => {
        history.push(routeCandidateProfile(candidate.candidateId));
    };

    const getFilterCount = () => {
        let count = 0;
        if (filter.candidateStatus) {
            count++;
        }
        if (filter.jobTitle) {
            count++;
        }
        return count;
    };

    const getSortCount = () => {
        let count = 0;
        if (sort.name) {
            count++;
        }
        if (sort.createdDate) {
            count++;
        }
        return count;
    };

    const getFilterContainer = (
        <HeaderMetaContainer>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Status</FormLabelSmall>
                <Select
                    style={{ minWidth: 200 }}
                    defaultValue={filter.candidateStatus}
                    placeholder='Status'
                    options={candidateStatusOptions}
                    filterOption={filterOptionLabel}
                    onSelect={onStatusFilterChange}
                />
            </Space>
        </HeaderMetaContainer>
    );

    const getSortContainer = (
        <HeaderMetaContainer>
            <Space direction='vertical' size={2}>
                <FormLabelSmall>Name</FormLabelSmall>
                <Select
                    allowClear
                    style={{ minWidth: 160 }}
                    defaultValue={sort.name}
                    placeholder='None'
                    onSelect={onNameSortChange}
                    onClear={() => onNameSortChange(undefined)}
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

    const getHeaderContainer = (
        <HeaderContainer>
            <Header>
                <Space size={16}>
                    <HeaderSearch
                        placeholder='Search for candidate'
                        onSearchTextChange={onSearchTextChange}
                        defaultValue={filter.search}
                    />
                    <FilterButton
                        open={headerMeta.filterOpen}
                        count={getFilterCount()}
                        onClick={() =>
                            setHeaderMeta({
                                filterOpen: !headerMeta.filterOpen,
                                sortOpen: false,
                            })
                        }
                    />

                    <SearchButton
                        open={headerMeta.sortOpen}
                        count={getSortCount()}
                        onClick={() =>
                            setHeaderMeta({
                                filterOpen: false,
                                sortOpen: !headerMeta.sortOpen,
                            })
                        }
                    />
                </Space>
                {addCandidateButtonVisible && (
                    <Button
                        type='primary'
                        icon={
                            <AntIconSpan>
                                <Plus size='1em' />
                            </AntIconSpan>
                        }
                        onClick={onAddCandidate}
                    >
                        Add candidate
                    </Button>
                )}
            </Header>
            {headerMeta.filterOpen && getFilterContainer}
            {headerMeta.sortOpen && getSortContainer}
        </HeaderContainer>
    );

    const actionsMenu = (candidate: CandidateDetails): ItemType[] => [
        {
            key: "archive",
            label: candidate.archived ? "Restore Archive" : "Archive",
            onClick: e => {
                e.domEvent.stopPropagation();
                if (candidate.archived) {
                    dispatch(restoreArchivedCandidate(candidate.candidateId));
                } else {
                    dispatch(archiveCandidate(candidate.candidateId));
                }
            },
        },
    ];

    const columns: ColumnsType<Candidate> = [
        {
            title: <TableHeader>CANDIDATE</TableHeader>,
            key: "candidateName",
            render: (candidate: Candidate) => (
                <Space>
                    <InitialsAvatar interviewerName={candidate.candidateName} />
                    <FormLabelSmall className='fs-mask'>{candidate.candidateName}</FormLabelSmall>
                </Space>
            ),
        },
        {
            title: <TableHeader>POSITION</TableHeader>,
            key: "position",
            render: (candidate: Candidate) => <FormLabelSmall>{candidate.position ?? "-"}</FormLabelSmall>,
        },
        {
            title: <TableHeader>CREATED DATE</TableHeader>,
            key: "createdDate",
            render: (candidate: Candidate) => (
                <FormLabelSmall>{getFormattedDateShort(candidate.createdDate, "-")}</FormLabelSmall>
            ),
        },
        {
            key: "actions",
            render: candidate => (
                <Dropdown
                    menu={{
                        items: actionsMenu(candidate),
                    }}
                >
                    <ActionsButton icon={<MoreHorizontal size={16} />} onClick={e => e.stopPropagation()} />
                </Dropdown>
            ),
        },
    ];

    return (
        <Layout header={getHeaderContainer}>
            <TitleContainer>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Candidates
                </Title>
                <Spin spinning={candidatesLoading} />
            </TitleContainer>
            <ConfigProvider renderEmpty={() => <EmptyState message='You currently don’t have any candidates.' />}>
                <Card>
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
                        rowClassName={styles.row}
                        onRow={(record: Candidate) => ({
                            onClick: () => onCandidateClicked(record),
                        })}
                    />
                </Card>
            </ConfigProvider>
            <CreateCandidateModal
                open={addCandidateVisible}
                onCancel={() => setAddCandidateVisible(false)}
                onSave={() => setAddCandidateVisible(false)}
            />
        </Layout>
    );
};

export default Candidates;

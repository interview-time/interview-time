import { Button, Input } from "antd";
import { Filter as FilterIcon, Search, SortDesc } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { Colors } from "../../assets/styles/colors";
import { TagNumber } from "../../assets/styles/global-styles";
import AntIconSpan from "../buttons/ant-icon-span";

export const HeaderContainer = styled.div`
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

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const HeaderSearchStyle = styled(Input)`
    width: 280px;
    border-radius: 6px;
`;

const FilterIndicator = styled(TagNumber)`
    margin-left: 8px;
`;

type BorderedButtonProps = {
    borderColor: string;
};

const BorderedButton = styled(Button)`
    border-color: ${(props: BorderedButtonProps) => props.borderColor};
`;

type HeaderSearchProps = {
    onSearchTextChange: (text: string) => void;
    placeholder: string;
    defaultValue?: string;
};

export const HeaderSearch = ({ onSearchTextChange, placeholder, defaultValue }: HeaderSearchProps) => (
    <HeaderSearchStyle
        allowClear
        placeholder={placeholder}
        defaultValue={defaultValue}
        prefix={<Search size={18} color={Colors.Neutral_400} />}
        onChange={e => onSearchTextChange(e.target.value)}
    />
);

type FilterProps = {
    open: boolean;
    count: number;
    onClick: () => void;
};

export const FilterButton = ({ open, count, onClick }: FilterProps) => (
    <BorderedButton
        icon={
            <AntIconSpan>
                <FilterIcon size='1em' />
            </AntIconSpan>
        }
        onClick={onClick}
        borderColor={open ? Colors.Primary_500 : Colors.Neutral_200}
    >
        Filter {count !== 0 && <FilterIndicator>{count}</FilterIndicator>}
    </BorderedButton>
);

type SearchProps = {
    open: boolean;
    count: number;
    onClick: () => void;
};

export const SearchButton = ({ open, count, onClick }: SearchProps) => (
    <BorderedButton
        icon={
            <AntIconSpan>
                <SortDesc size='1em' />
            </AntIconSpan>
        }
        onClick={onClick}
        borderColor={open ? Colors.Primary_500 : Colors.Neutral_200}
    >
        Sort {count !== 0 && <FilterIndicator>{count}</FilterIndicator>}
    </BorderedButton>
);

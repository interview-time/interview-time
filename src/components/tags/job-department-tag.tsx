import styled from "styled-components";
import { Typography } from "antd";

const { Text } = Typography;

type DepartmentTagProps = {
    textColor: string;
    backgroundColor: string;
};

const DepartmentTag = styled(Text)`
    font-size: 14px;
    font-weight: 500;
    border-radius: 24px;
    color: ${(props: DepartmentTagProps) => props.textColor};
    background: ${(props: DepartmentTagProps) => props.backgroundColor};
    padding: 4px 12px;
`;

type Props = {
    department: string;
};

const colors = [
    {
        text: "rgba(65, 105, 225, 1)",
        background: "rgba(65, 105, 225, 0.1)",
    },
    {
        text: "rgba(47, 165, 45, 1)",
        background: "rgba(47, 165, 45, 0.1)",
    },
    {
        text: "rgba(255, 87, 34, 1)",
        background: "rgba(255, 87, 34, 0.1)",
    },
    {
        text: "rgba(117, 114, 129, 1)",
        background: "rgba(117, 114, 129, 0.1)",
    },
    {
        text: "rgba(122, 105, 238, 1)",
        background: "rgba(122, 105, 238, 0.1)",
    },
    {
        text: "rgba(6, 161, 146, 1)",
        background: "rgba(6, 161, 146, 0.1)",
    },
    {
        text: "rgba(255, 160, 46, 1)",
        background: "rgba(255, 160, 46, 0.1)",
    },
    {
        text: "rgba(244, 45, 45, 1)",
        background: "rgba(244, 45, 45, 0.1)",
    },
    {
        text: "rgba(33, 32, 33, 1)",
        background: "rgba(33, 32, 33, 0.1)",
    },
    {
        text: "rgba(11, 180, 254, 1)",
        background: "rgba(11, 180, 254, 0.1)",
    },
];

const JobDepartmentTag = ({ department }: Props) => {
    // generate index [0-9] based on department name
    const tagColorIndex = () => {
        let charCodeSum: number;
        if (department.length > 2) {
            charCodeSum = department.charCodeAt(0) + department.charCodeAt(1) + department.charCodeAt(1);
        } else if (department.length > 1) {
            charCodeSum = department.charCodeAt(0) + department.charCodeAt(1);
        } else {
            charCodeSum = department.charCodeAt(0);
        }

        let index = charCodeSum % 10;
        while (index > 9) {
            index = index % 10;
        }
        return index;
    };

    return (
        <DepartmentTag textColor={colors[tagColorIndex()].text} backgroundColor={colors[tagColorIndex()].background}>
            {department}
        </DepartmentTag>
    );
};

export default JobDepartmentTag;

import styled from "styled-components";
import { Typography } from "antd";
import { getTagColor, getTagTextColor } from "../../utils/color";

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

const JobDepartmentTag = ({ department }: Props) => {

    return (
        <DepartmentTag
            textColor={getTagTextColor(department)}
            backgroundColor={getTagColor(department)}
        >
            {department}
        </DepartmentTag>
    );
};

export default JobDepartmentTag;

import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const MenuNoneSvg = () => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
        <rect x='2' y='3' width='16' height='2' fill='#374151' />
        <rect x='2' y='7' width='16' height='2' fill='#374151' />
        <rect x='2' y='11' width='16' height='2' fill='#374151' />
        <rect x='2' y='15' width='16' height='2' fill='#374151' />
    </svg>
);

const MenuNoneIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={MenuNoneSvg} {...props} />;

export default MenuNoneIcon;

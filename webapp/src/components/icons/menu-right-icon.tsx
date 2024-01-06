import Icon from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const MenuRightSvg = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="11" height="2" fill="#374151"/>
        <rect x="18" y="3" width="14" height="3" transform="rotate(90 18 3)" fill="#374151"/>
        <rect x="2" y="7" width="11" height="2" fill="#374151"/>
        <rect x="2" y="11" width="11" height="2" fill="#374151"/>
        <rect x="2" y="15" width="11" height="2" fill="#374151"/>
    </svg>

);

const MenuRightIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={MenuRightSvg} {...props} />;

export default MenuRightIcon;

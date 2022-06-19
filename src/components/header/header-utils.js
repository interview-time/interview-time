import { Button, Space } from "antd";
import { BackIcon, CloseIcon } from "../../utils/icons";
import { routeHome } from "../../utils/route";

export const createCloseBackButton = (history) => (
    <Space size={16}>
        {history.action !== "POP" ? (
            <Button icon={<BackIcon />} size='large' onClick={() => history.goBack()} />
        ) : (
            <Button icon={<CloseIcon />} size='large' onClick={() => history.replace(routeHome())} />
        )}
    </Space>
);
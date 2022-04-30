import { List, Modal } from "antd";
import React from "react";
import moment from "moment";
import styles from "./modal-news.module.css";
import { getFormattedDateShort } from "../../components/utils/date";

export const newsData = [
    {
        version: "v1.300422",
        date: moment("30/04/2022", "DD/MM/YYYY").valueOf(),
        description: <div>
            <ul className={styles.list}>
                <li>🆕 You can now invite team members by email.</li>
                <li>🐛 Minor bug fixes.</li>
            </ul>
        </div>,
    },
    {
        version: "v1.180422",
        date: moment("18/04/2022", "DD/MM/YYYY").valueOf(),
        description: <div>
            <ul className={styles.list}>
                <li>🆕 "Reports" page has been moved inside "Interviews" page.</li>
                <li>🆕 Previously input interview positions are now populated in the autocomplete during the creation of a new interview.</li>
                <li> New public interview template "iOS Engineer".</li>
                <li>🐛 Minor bug fixes.</li>
            </ul>
        </div>,
    },
    {
        version: "v1.060322",
        date: moment("06/04/2022", "DD/MM/YYYY").valueOf(),
        description: <div>
            <ul className={styles.list}>
                <li>🔥 Interview 'Report' page now displays charts based on answered questions that helps to make even better candidate assessment.</li>
                <li>🆕 Added 'What's new' page.</li>
                <li>🐛 Fixed issue when 'Report' page wasn't displaying questions with notes.</li>
                <li>🐛 Fixed issue when 'Report' page was displaying interviewer name instead of candidate name.</li>
            </ul>
        </div>,
    }
];

const NewsModal = ({ visible, onClose }) => {

    const onCancelClicked = () => {
        onClose();
    };

    return (
        <Modal
            destroyOnClose={true}
            title={"Recent updates from the Interviewer team"}
            visible={visible}
            closable={true}
            footer={null}
            width={600}
            bodyStyle={{ padding: 0 }}
            onCancel={onCancelClicked}
        >
            <List
                size='large'
                dataSource={newsData}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={`${getFormattedDateShort(item.date)}`}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default NewsModal;

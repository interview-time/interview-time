import { Button, Divider, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "./modal-news.module.css";
import { Typography } from "antd";
import candidateProfileImg from "../../assets/whats-new/candidate-profile.png";
import checklistImg from "../../assets/whats-new/checklist.png";

import { updateNewsVisitTime } from "../../utils/storage";

const { Title } = Typography;

export const newsData = [
    {
        version: "v1.221203",
        versionInt: 221203, // version reversed
        date: new Date(2022, 12, 3),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Candidate Profile New Look!
                </Title>
                <div className={styles.carouselDescription}>
                    Now you can instantly see where the candidate is in the interviewing pipeline. Candidate information
                    like CV, email, and location are also easily accessible from the page.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img
                        alt="Take-Home Assignment Interview Type"
                        src={candidateProfileImg}
                        className={styles.carouselImage}
                    />
                </div>
            </div>
        )
    },
    {
        version: "v1.221203",
        versionInt: 221203, // version reversed
        date: new Date(2022, 12, 3),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Interview Checklist
                </Title>
                <div className={styles.carouselDescription}>
                    Interview information moved to collapsible right panel along with a new feature - interview
                    checklist. You can use it to define quick reminders for you prior to interview.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img
                        alt="Take-Home Assignment Interview Type"
                        src={checklistImg}
                        className={styles.carouselImage}
                    />
                </div>
            </div>
        )
    }
];

const NewsModal = ({ visible, onClose }) => {
    const [activeItem, setActiveItem] = React.useState(0);

    useEffect(() => {
        updateNewsVisitTime();
    }, []);

    const onCancelClicked = () => {
        onClose();
    };

    const onNextClicked = () => {
        setActiveItem(prevState => (prevState < newsData.length - 1 ? prevState + 1 : prevState));
    };

    const onPreviousClicked = () => {
        setActiveItem(prevState => (prevState > 0 ? prevState - 1 : prevState));
    };

    return (
        <Modal
            destroyOnClose={true}
            title="What's New"
            visible={visible}
            closable={true}
            footer={null}
            width={600}
            bodyStyle={{ padding: 0 }}
            onCancel={onCancelClicked}
        >
            <div className={styles.carousel}>
                <Divider className={styles.divider} />
                {newsData[activeItem].content}
                <Divider className={styles.divider} />
                <div className={styles.arrowHolder}>
                    <Button type="text" disabled={activeItem === 0} onClick={onPreviousClicked}>
                        ← Previous
                    </Button>
                    <Button type="text" disabled={activeItem === newsData.length - 1} onClick={onNextClicked}>
                        Next →
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default NewsModal;

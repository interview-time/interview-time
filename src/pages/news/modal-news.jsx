import { Button, Divider, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "./modal-news.module.css";
import Title from "antd/lib/typography/Title";
import candidateProfileImg from "../../assets/candidate-profile.png";

import { updateNewsVisitTime } from "../../utils/storage";

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
                        alt='Take-Home Assignment Interview Type'
                        src={candidateProfileImg}
                        className={styles.carouselImage}
                    />
                </div>
            </div>
        ),
    },
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
                    <Button type='text' disabled={activeItem === 0} onClick={onPreviousClicked}>
                        ← Previous
                    </Button>
                    <Button type='text' disabled={activeItem === newsData.length - 1} onClick={onNextClicked}>
                        Next →
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default NewsModal;

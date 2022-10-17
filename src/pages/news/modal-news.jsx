import { Button, Divider, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "./modal-news.module.css";
import Title from "antd/lib/typography/Title";
import liveCodingTypeImage from "../../assets/live-coding-type.gif";
import shareChallengeImage from "../../assets/share-challenge.gif";
import takeHomeImage from "../../assets/take-home-assignment.gif";
import { updateNewsVisitTime } from "../../utils/storage";

export const newsData = [
    {
        version: "v1.221017",
        versionInt: 221017, // version reversed
        date: new Date(2022, 10, 17),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Take-Home Assignment Interview Type
                </Title>
                <div className={styles.carouselDescription}>
                    Create and share take-home assignments with the candidate. Wait until the candidate submits the
                    solution. Evaluate candidates' codes based on your assessment criteria.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img alt='Take-Home Assignment Interview Type' src={takeHomeImage} className={styles.carouselImage} />
                </div>
            </div>
        ),
    },
    {
        version: "v1.220930",
        versionInt: 220930, // version reversed
        date: new Date(2022, 9, 30),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Live Coding Interview Type
                </Title>
                <div className={styles.carouselDescription}>
                    Now you can assess candidates coding abilities during the tech interview. Create a coding challenge
                    and attach it to your template as a zip file or public GitHub repo.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img alt='Live Coding Interview Type' src={liveCodingTypeImage} className={styles.carouselImage} />
                </div>
            </div>
        ),
    },
    {
        version: "v1.220930",
        versionInt: 220930, // version reversed
        date: new Date(2022, 9, 30),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Share Coding Challenge
                </Title>
                <div className={styles.carouselDescription}>
                    Share coding challenges with the candidate during the interview. The temporary link will expire once
                    the interview is completed.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img alt='Share coding challenge' src={shareChallengeImage} className={styles.carouselImage} />
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

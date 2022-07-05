import { Button, Divider, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "./modal-news.module.css";
import Title from "antd/lib/typography/Title";
import redFlagsImage from "../../assets/red-flags.gif";
import { updateNewsVisitTime } from "../../utils/storage";

export const newsData = [
    {
        version: "v1.050722",
        versionInt: 220705, // version reversed
        date: new Date(2022, 7, 5),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Red flags
                </Title>
                <div className={styles.carouselDescription}>
                    We added special 'red flags' card next to 'quick notes' to make it easier for you to capture and
                    present this critical information.
                </div>
                <img alt='No answer gif' src={redFlagsImage} className={styles.carouselImage} />
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

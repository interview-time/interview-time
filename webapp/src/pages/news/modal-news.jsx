import { Button, Divider, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "./modal-news.module.css";
import { Typography } from "antd";
import pipelineGif from "../../assets/whats-new/pipeline.gif";

import { updateNewsVisitTime } from "../../utils/storage";

const { Title } = Typography;

export const newsData = [
    {
        version: "v1.221203",
        versionInt: 230114, // version reversed
        date: new Date(2023, 1, 14),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Jobs and candidate pipelines!
                </Title>
                <div className={styles.carouselDescription}>
                    Now you can define jobs and have complete visibility with candidate pipelines.
                </div>
                <div className={styles.carouselImageWrapper}>
                    <img alt='Candidate pipeline' src={pipelineGif} className={styles.carouselImage} />
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

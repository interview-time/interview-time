import { Button, Divider, Modal } from "antd";
import React, { useEffect} from "react";
import styles from "./modal-news.module.css";
import Title from "antd/lib/typography/Title";
import shareScorecardImage from "../../assets/news-share-scorecard.gif";
import noAnswerImage from "../../assets/no-answer.gif";
import Text from "antd/lib/typography/Text";
import { updateNewsVisitTime } from "../../components/utils/storage";

export const newsData = [
    {
        version: "v1.150522",
        versionInt: 220515, // version reversed
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Share scorecard reports
                </Title>
                <Text type='secondary' className={styles.carouselDescription}>
                    Create a public link of interview reports to share with anyone.
                </Text>
                <img alt='Share scorecard gif' src={shareScorecardImage} className={styles.carouselImage} />
            </div>
        ),
    },
    {
        version: "v1.150522",
        versionInt: 220515, // version reversed
        date: new Date(2022, 5, 15),
        content: (
            <div className={styles.carouselItem}>
                <Title level={5} className={styles.carouselTitle}>
                    Mark questions as unanswered
                </Title>
                <Text type='secondary' className={styles.carouselDescription}>
                    You can now mark unanswered questions for better score calculation.
                </Text>
                <img alt='No answer gif' src={noAnswerImage} className={styles.carouselImage} />
            </div>
        ),
    },
];

const NewsModal = ({ visible, onClose }) => {
    const [activeItem, setActiveItem] = React.useState(0);

    useEffect(() => {
        console.log("updateNewsVisitTime");
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

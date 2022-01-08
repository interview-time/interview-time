import React, { useEffect, useState } from "react";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import styles from "./time-ago.module.css";

const TimeAgo = ({ timestamp, saving }) => {
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (timestamp) {
                setLastSaved(moment(timestamp).fromNow());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return saving ? <Text type="secondary" className={styles.text}>Saving...</Text> :
        <Text type="secondary" className={styles.text}>{lastSaved ? `Last saved ${lastSaved}` : ""}</Text>;
};

export default TimeAgo;

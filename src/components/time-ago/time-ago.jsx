import React, { useEffect, useState } from "react";
import Text from "antd/lib/typography/Text";
import styles from "./time-ago.module.css";
import { formatDistanceToNow } from "date-fns";
import { parseDateISO } from "../utils/date-fns";

const TimeAgo = ({ timestamp, saving }) => {
    const [lastSaved, setLastSaved] = useState(null);

    useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (timestamp) {
                setLastSaved(formatDistanceToNow(parseDateISO(timestamp), { addSuffix: true }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return saving ? (
        <Text type='secondary' className={styles.text}>
            Saving...
        </Text>
    ) : (
        <Text type='secondary' className={styles.text}>
            {lastSaved ? `Last saved ${lastSaved}` : ""}
        </Text>
    );
};

export default TimeAgo;

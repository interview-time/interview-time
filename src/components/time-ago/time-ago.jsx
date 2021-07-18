import React, { useState, useEffect } from "react";
import Text from "antd/lib/typography/Text";
import moment from "moment";

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

    return saving ? <Text>Saving...</Text> : <Text>{lastSaved ? `Last saved ${lastSaved}` : ""}</Text>;
};

export default TimeAgo;

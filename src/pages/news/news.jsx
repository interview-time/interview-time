import styles from "./news.module.css";
import Layout from "../../components/layout/layout";
import { List, PageHeader } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import { updateNewsVisitTime } from "../../components/utils/storage";
import moment from "moment";

export const updatesData = [
    {
        version: "v0.3.2",
        date: moment("2021/02/23", "YYYY/MM/DD").valueOf(),
        description: "What's new section 📢",
    },
    {
        version: "v0.3.1",
        date: moment("2021/02/20", "YYYY/MM/DD").valueOf(),
        description: "New menu icons.",
    },
    {
        version: "v0.3.0",
        date: moment("2021/02/19", "YYYY/MM/DD").valueOf(),
        description: "You can now import questions from the CSV file.",
    },
    {
        version: "v0.2.2",
        date: moment("2021/02/13", "YYYY/MM/DD").valueOf(),
        description: "Question Bank cards now have Edit/Remove actions.",
    },
    {
        version: "v0.2.1",
        date: moment("2021/02/11", "YYYY/MM/DD").valueOf(),
        description: "Template cards now have Edit/Copy/Remove actions.",
    },
    {
        version: "v0.2 ",
        date: moment("2021/02/09", "YYYY/MM/DD").valueOf(),
        description: "Updated Interview Experience.",
    },
    {
        version: "v0.1 ",
        date: moment("2021/02/01", "YYYY/MM/DD").valueOf(),
        description: "Closed Beta Release 🚀",
    }
];

const News = () => {

    const [updateState, setUpdateState] = React.useState(false)

    React.useEffect(() => {
        updateNewsVisitTime()
        setUpdateState(!updateState)
        // eslint-disable-next-line
    }, [])

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="What's new"
        >
        </PageHeader>}>

            <List
                size="large"
                header={<Text strong>Recent updates from the Interviewer team.</Text>}
                bordered
                dataSource={updatesData}
                renderItem={item =>
                    <List.Item>
                        <List.Item.Meta
                            title={moment(item.date).format("MMM DD, YYYY") + " • " + item.version}
                            description={item.description}
                        />
                    </List.Item>
                }
            />
        </Layout>
    )
}
export default News;
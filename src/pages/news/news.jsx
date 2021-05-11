import styles from "./news.module.css";
import Layout from "../../components/layout/layout";
import { Card, Col, List, Row } from "antd";
import React from "react";
import Text from "antd/lib/typography/Text";
import { updateNewsVisitTime } from "../../components/utils/storage";
import moment from "moment";
import StickyHeader from "../../components/layout/header-sticky";

export const updatesData = [
    {
        version: "v0.5.0",
        date: moment("2021/05/11", "YYYY/MM/DD").valueOf(),
        description: "New Interview Scorecard & Candidate Evaluation experience. General design updates.",
    },
    {
        version: "v0.4.2",
        date: moment("2021/04/27", "YYYY/MM/DD").valueOf(),
        description: "Candidates section let you to compare several candidates and find the best performer.",
    },
    {
        version: "v0.4.1",
        date: moment("2021/04/26", "YYYY/MM/DD").valueOf(),
        description: "Community section has been renamed to Library and moved to separate menu item. Updated design of question categories.",
    },
    {
        version: "v0.4.0",
        date: moment("2021/03/08", "YYYY/MM/DD").valueOf(),
        description: "Question Bank now has Community section.",
    },
    {
        version: "v0.3.5",
        date: moment("2021/03/04", "YYYY/MM/DD").valueOf(),
        description: "New Template and Question Bank cards design",
    },
    {
        version: "v0.3.4",
        date: moment("2021/02/23", "YYYY/MM/DD").valueOf(),
        description: "Feedback section 📝",
    },
    {
        version: "v0.3.3",
        date: moment("2021/02/21", "YYYY/MM/DD").valueOf(),
        description: "Quick start section 🚀",
    },
    {
        version: "v0.3.2",
        date: moment("2021/02/19", "YYYY/MM/DD").valueOf(),
        description: "What's new section 📢 and Profile section 👤",
    },
    {
        version: "v0.3.1",
        date: moment("2021/02/17", "YYYY/MM/DD").valueOf(),
        description: "New menu icons.",
    },
    {
        version: "v0.3.0",
        date: moment("2021/02/16", "YYYY/MM/DD").valueOf(),
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
        <Layout pageHeader={
            <StickyHeader title="What's new" />
        } contentStyle={styles.pageContent}>
            <Row>
                <Col
                    xxl={{ span: 16, offset: 4 }}
                    xl={{ span: 20, offset: 2 }}
                    lg={{ span: 24 }}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <List
                            size="large"
                            header={<Text strong style={{ marginLeft: 24 }}>Recent updates from the Interviewer
                                team.</Text>}
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
                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}
export default News;
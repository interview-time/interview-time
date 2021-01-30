import React, { useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/layout";
import { deleteQuestion, loadQuestionBank } from "../../store/question-bank/actions";
import { PageHeader, Result, Tabs } from 'antd';
import styles from "./question-bank.module.css";
import QuestionBankPersonal from "../../components/question-bank-personal/question-bank";

const { TabPane } = Tabs;

const TAB_PERSONAL = "personal"
const TAB_COMMUNITY = "community"

const QuestionBank = ({ questions, loading, loadQuestionBank}) => {
    const [tab, setTab] = useState(TAB_PERSONAL)

    React.useEffect(() => {
        if ((!questions || questions.length === 0) && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line 
    }, []);

    const onTabClicked = (key) => {
        if (key === TAB_PERSONAL) {
            setTab(TAB_PERSONAL)
        } else if (key === TAB_COMMUNITY) {
            setTab(TAB_COMMUNITY)
        }
    }

    const isPersonalTab = () => tab === TAB_PERSONAL

    const isCommunityTab = () => tab === TAB_COMMUNITY

    return (
        <Layout pageHeader={<PageHeader
            className={styles.pageHeader}
            title="Question Bank"
            footer={
                <Tabs defaultActiveKey={tab} onChange={onTabClicked}>
                    <TabPane key={TAB_PERSONAL} tab="Personal" />
                    <TabPane key={TAB_COMMUNITY} tab="Community" />
                </Tabs>
            }
        />}>
            {isPersonalTab() && <QuestionBankPersonal />}

            {isCommunityTab() && <Result
                status="403"
                title="Coming soon"
                subTitle="Sorry, this page is under construction."
            />}

        </Layout>
    )
}

const mapStateToProps = state => {
    const { loading, categories, questions } = state.questionBank || {};

    return {
        questions,
        categories,
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank, deleteQuestion })(QuestionBank);
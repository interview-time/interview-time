import React, { useState } from 'react';
import { connect } from "react-redux";
import { loadQuestionBank } from "../../store/question-bank/actions";
import InterviewDetailsCard from "../interview/interview-details-card";
import lang from "lodash/lang";

const GuideInterviewDetailsCard = ({ guide, header, questions, loading, loadQuestionBank }) => {

    const [interview, setInterview] = useState({})

    React.useEffect(() => {
        // initial question bank loading
        if (questions.length === 0 && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (!interview.structure && questions.length !== 0 && guide.structure.groups.length !== 0) {
            let interview = {
                structure: lang.cloneDeep(guide.structure)
            }

            interview.structure.groups.forEach(group => {
                group.questions = group.questions
                    .map(questionId => questions.find(item => item.questionId === questionId))
            })
            console.log(interview)
            setInterview(interview)
        }

    }, [questions, guide]);

    return <InterviewDetailsCard
        interview={interview}
        guide={guide}
        header={header}
        disabled={true} />
}

const mapStateToProps = state => {
    const { loading, questions } = state.questionBank || {};

    return {
        questions: questions,
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank })(GuideInterviewDetailsCard);
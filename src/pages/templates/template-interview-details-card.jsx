import React, { useState } from 'react';
import { connect } from "react-redux";
import { loadQuestionBank } from "../../store/question-bank/actions";
import InterviewDetailsCard from "../interview/interview-details-card";
import { cloneDeep } from "lodash/lang";
import { defaultTo } from "lodash/util";
import { flatMap } from "lodash/collection";

const TemplateInterviewDetailsCard = ({ guide, questions, loading, loadQuestionBank }) => {

    const [interview, setInterview] = useState({})

    React.useEffect(() => {
        // initial question bank loading
        if (questions.length === 0 && !loading) {
            loadQuestionBank();
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        if (guide && guide.structure) {
            let interview = {
                structure: {
                    header: guide.structure.header,
                    footer: guide.structure.footer,
                    groups: cloneDeep(guide.structure.groups)
                }
            }

            interview.structure.groups.forEach(group => {
                const interviewQuestions = group.questions
                    .map(questionId => questions.find(item => item.questionId === questionId))
                group.questions = defaultTo(interviewQuestions, [])
            })

            setInterview(interview)
        }
        // eslint-disable-next-line
    }, [questions, guide]);

    return <InterviewDetailsCard interview={interview} hideAnchor={true} />
}

const mapStateToProps = state => {
    const { loading, categories } = state.questionBank || {};

    return {
        questions: flatMap(categories, (item) => item.questions),
        loading
    };
};

export default connect(mapStateToProps, { loadQuestionBank })(TemplateInterviewDetailsCard);
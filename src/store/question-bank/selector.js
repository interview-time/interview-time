import { createSelector } from 'reselect'

const getQuestionBank = (state) => state.questionBank.questions;

export const getQuestions = createSelector(
    [getQuestionBank],
    (questions) => {
        if (questions) {            
            return questions.filter(q => q.category === 'JavaScript');
        }

        return [];
    }
);
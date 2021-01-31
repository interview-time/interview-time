import { includes } from "./comparators";
import { defaultTo } from "lodash/util";

export const filterQuestionCategory = (questions, category) => {
    return defaultTo(questions, [])
        .filter(question => question.category === category)
}

export const filterQuestionText = (questions, textFilter) => {
    return defaultTo(questions, [])
        .filter(question => includes(question.question, textFilter, true))
}

export const filterQuestionTag = (questions, tagFilter) => {
    return defaultTo(questions, [])
        .filter(question => defaultTo(question.tags, []).find(tag => includes(tag, tagFilter)))
}

export const filterQuestionDifficulty = (questions, difficultyFilter) => {
    return defaultTo(questions, [])
        .filter(question => difficultyFilter === question.difficulty)
}
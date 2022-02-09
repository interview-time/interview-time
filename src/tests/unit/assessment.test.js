import { Difficulty, QuestionAssessment } from "../../components/utils/constants";
import { getQuestionsAssessment } from "../../components/utils/assessment";

test('test getQuestionsAssessment all EASY all EXCELLENT', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(100);
});

test('test getQuestionsAssessment all EASY all POOR', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
    ]

    expect(getQuestionsAssessment(questions)).toBe(40);
});

test('test getQuestionsAssessment all EASY all GOOD', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(80);
});

test('test getQuestionsAssessment all EASY mixed assessment', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(65);
});

test('test getQuestionsAssessment all MEDIUM all EXCELLENT', () => {
    let questions = [
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(100);
});

test('test getQuestionsAssessment all MEDIUM all POOR', () => {
    let questions = [
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
    ]

    expect(getQuestionsAssessment(questions)).toBe(40);
});

test('test getQuestionsAssessment all MEDIUM all GOOD', () => {
    let questions = [
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(80);
});

test('test getQuestionsAssessment all MEDIUM mixed assessment', () => {
    let questions = [
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(65);
});

test('test getQuestionsAssessment all HARD all EXCELLENT', () => {
    let questions = [
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(100);
});

test('test getQuestionsAssessment all HARD all POOR', () => {
    let questions = [
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.POOR),
    ]

    expect(getQuestionsAssessment(questions)).toBe(40);
});

test('test getQuestionsAssessment all HARD all GOOD', () => {
    let questions = [
        question(Difficulty.HARD, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(80);
});

test('test getQuestionsAssessment all HARD mixed assessment', () => {
    let questions = [
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(65);
});

test('test getQuestionsAssessment mixed difficulty all POOR', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.POOR),
    ]

    expect(getQuestionsAssessment(questions)).toBe(40);
});

test('test getQuestionsAssessment mixed difficulty all GOOD', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(80);
});

test('test getQuestionsAssessment mixed difficulty all EXCELLENT', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(100);
});

test('test getQuestionsAssessment mixed difficulty mixed assessment 1', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(60);
});

test('test getQuestionsAssessment mixed difficulty mixed assessment 2', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.GOOD),
    ]

    expect(getQuestionsAssessment(questions)).toBe(73);
});

test('test getQuestionsAssessment mixed difficulty mixed assessment 3', () => {
    let questions = [
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.EXCELLENT),
        question(Difficulty.EASY, QuestionAssessment.GOOD),
        question(Difficulty.EASY, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.GOOD),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.MEDIUM, QuestionAssessment.POOR),
        question(Difficulty.MEDIUM, QuestionAssessment.EXCELLENT),
        question(Difficulty.HARD, QuestionAssessment.POOR),
        question(Difficulty.HARD, QuestionAssessment.EXCELLENT),
    ]

    expect(getQuestionsAssessment(questions)).toBe(77);
});

/**
 *
 * @param difficulty
 * @param assessment
 * @returns {Question}
 */
function question(difficulty, assessment) {
    return {
        difficulty: difficulty,
        assessment: assessment
    }
}
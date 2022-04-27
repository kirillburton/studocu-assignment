import { getChildElementLocator } from "../../helpers/ListHelpers.js";
import { QuestionBuilder } from "../../helpers/QuestionBuilder.js";
import { QuestionsPageSelectors as selectors} from "./QuestionsPageSelectors.js";

export class QuestionsPage {
    constructor(ctx, isAlreadyOpen) {
        this.ctx = ctx;
        if (!isAlreadyOpen) this.ctx.visit(''); 
    }
    get questionInput() { return this.ctx.get(selectors.questionInput); }
    get answerInput() { return this.ctx.get(selectors.answerInput); }
    get submitButton() { return this.ctx.get(selectors.submitButton); }
    get sortButton() { return this.ctx.get(selectors.sortButton); }
    get removeQuestionsButton() { return this.ctx.get(selectors.removeQuestionsButton); }
    get firstQuestion() { return this.ctx.get(`${getChildElementLocator(selectors.questionList, 1)} ${selectors.question}`); }
    get firstAnswer() { return this.ctx.get(`${getChildElementLocator(selectors.questionList, 1)} ${selectors.answer}`); }
    get sidebar() { return this.ctx.get(selectors.sidebar); }
    get questionsTitle() { return this.ctx.get(selectors.questionsTitle); }
    get questionsTooltip() { return this.ctx.get(selectors.questionsTooltip); }
    get questionMakerTitle() { return this.ctx.get(selectors.questionMakerTitle); }
    get questionMakerTooltip() { return this.ctx.get(selectors.questionMakerTooltip); }
    get header() { return this.ctx.get(selectors.header); }
    get noQuestionsAlert() { return this.ctx.get(selectors.noQuestionsAlert); }

    getNthQuestion(n) {
        return this.ctx.get(`${getChildElementLocator(selectors.questionList, n)} ${selectors.question}`);
    }
    getNthAnswer(n) {
        return this.ctx.get(`${getChildElementLocator(selectors.questionList, n)} ${selectors.answer}`);
    }

    inputQuestion(questionPair) {
        if(questionPair.question) this.questionInput.type(questionPair.question);
        if(questionPair.answer) this.answerInput.type(questionPair.answer);
    }

    submitQuestion() {
        this.submitButton.click();
    }

    submitRandomQuestion() {
        const question = new QuestionBuilder().build();
        this.inputQuestion(question);
        this.submitQuestion();
    }

    sortQuestions() {
        this.sortButton.click();
    }

    removeAllQuestions() {
        this.removeQuestionsButton.click();
    }
}
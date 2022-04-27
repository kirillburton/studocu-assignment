// Class names or – even worse – xpaths as locators are highly discouraged, 
// we should assign test data attributes to everything we want to test.
// Or at least use ids. I would try to append them myself if the source code wasn't anonymized

export const QuestionsPageSelectors = {
    questionInput: '#question',
    answerInput: '#answer',
    submitButton: '.btn-success',
    sortButton: '.btn-primary',
    removeQuestionsButton: '.btn-danger',
    question: '.question__question',
    answer: '.question__answer',
    questionList: '.list-group-flush',
    sidebar: '.sidebar',
    questionsTitle: '.questions .tooltipped-title__title',
    questionsTooltip: '.questions .tooltipped-title__tooltip',
    questionMakerTitle: '.question-maker .tooltipped-title',
    questionMakerTooltip: '.question-maker .tooltipped-title__tooltip',
    header: '.header',
    noQuestionsAlert: '.alert-danger'
}
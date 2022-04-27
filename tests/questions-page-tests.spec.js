import { QuestionsPage } from './page-objects/questions-page/QuestionsPage.js';
import { QuestionBuilder } from './helpers/QuestionBuilder.js';

describe('Questions page', () => {  
    context('in landscape', () => {
        beforeEach(() => { cy.viewport('macbook-13'); })
        questionsSuite();
        desktopOnlyCases();
    });
    context('on mobile-like viewport', () => {
        beforeEach(() => { cy.viewport('iphone-xr'); })
        questionsSuite();
    })
});

function questionsSuite() {
    it('shows a sample question in default state', () => {
        // This test tests either default state of the page 
        // or previously saved question depending on our requirements.
        // In our case it's just to ensure the default question is shown.
        const page = new QuestionsPage(cy);

        page.firstQuestion
            .should('be.visible')
            .should('contain.text', 'How to add a question?');
    });

    it('allows to reveal an answer to a question', () => {
        const page = new QuestionsPage(cy);
        // It's a bad practice to depend on data/default behaviour that was not explicitly stated in the test.
        // Keeping that in mind we'll still use the default question here, because it's a test assignment 
        page.firstQuestion.click();

        page.firstAnswer
            .should('be.visible')
            .should('contain.text', 'Just use the form below!');
    })

    it('allows to submit first question', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const question = new QuestionBuilder().build();
        page.inputQuestion(question);
        page.submitQuestion();

        page.firstQuestion
            .should('be.visible')
            .should('contain.text', question.question);
    });

    it('adds a question with corresponding answer to the bottom of questions list', () => {
        const page = new QuestionsPage(cy);
        const question = new QuestionBuilder().build();
        page.inputQuestion(question);
        page.submitQuestion();

        page.firstQuestion
            .should('not.contain.text', question.question)
            .click();
        page.firstAnswer.should('not.contain.text', question.answer);
        page.getNthQuestion(2)
            .should('be.visible')
            .should('contain.text', question.question)
            .click();
        page.getNthAnswer(2)
            .should('be.visible')
            .should('contain.text', question.answer);
    });

    it('allows to remove all listed questions and corresponding controls', () => {
        const page = new QuestionsPage(cy);
        page.submitRandomQuestion();
        page.removeAllQuestions();
    
        page.noQuestionsAlert
            .should('be.visible')
            .should('contain.text', 'No questions yet :-(');
        page.sortButton.should('not.exist');
        page.removeQuestionsButton.should('not.exist');
        page.firstQuestion.should('not.exist');
    })

    it('allows to submit multiple questions', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        page.submitRandomQuestion();
        page.submitRandomQuestion();
        page.submitRandomQuestion();
        
        page.getNthQuestion(3).should('be.visible');
    });

    [0, 1, 10].forEach((amount) => {
        it(`counts listed questions correctly on a sidebar: ${amount}`, () => {
            const page = new QuestionsPage(cy);
            page.removeAllQuestions();
            for (let i = 0; i < amount; i++) page.submitRandomQuestion();

            page.sidebar.should(
                'contain.text',
                `${amount ? amount : 'no'} ${amount === 1 ? 'question' : 'questions'}`
            );
        });
    });

    it('sorts questions correctly', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const questionsToSubmit = prepareQuestionsWithExpectedPositionsInText();
        submitAllQuestions(questionsToSubmit);
        page.sortQuestions();

        assertOrder();

        function prepareQuestionsWithExpectedPositionsInText() {
            const unsortedQuestions = [
                'Q. Should be: ',
                '11. Should be: ',
                'A. Should be: ',
                '1. Should be: ',
                '9. Should be: '
            ];
            let questions = [];
            for (let question of unsortedQuestions) {
                question += ([...unsortedQuestions].sort()).indexOf(question) + 1;
                questions.push(new QuestionBuilder().setQuestion(question).build());
            }
            return questions;
        }
        function submitAllQuestions(arr) {
            for (let question of arr) {
                page.inputQuestion(question);
                page.submitQuestion();
            }
        }
        function assertOrder() {
            for (let i = 1; i < questionsToSubmit.length; i++) {
                page.getNthQuestion(i).should('include.text', `Should be: ${i}`);
            }
        }
    });

    it('sorts questions with their respective answers', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const firstQuestion = new QuestionBuilder()
            .setQuestion('02. First?')
            .setAnswer('First.')
            .build();
        const secondQuestion = new QuestionBuilder()
            .setQuestion('01. Second?')
            .setAnswer('Second.')
            .build();
        page.inputQuestion(firstQuestion);
        page.submitQuestion();
        page.inputQuestion(secondQuestion);
        page.submitQuestion();
        page.firstQuestion.click();
        page.getNthQuestion(2).click();
        page.sortQuestions();
        
        page.firstAnswer.should('contain.text', secondQuestion.answer);
        page.getNthAnswer(2).should('contain.text', firstQuestion.answer);
    });

    // Ideally, testing form validations should be in jest tests for each field,
    // but we should test that the whole page state is invalid when a required field is invalid
    // even though here the only validation is 'not empty'

    it('does not submit answer without a question', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const question = new QuestionBuilder().setQuestion('').build();
        page.inputQuestion(question);
        page.submitQuestion();

        page.questionInput.should('be.focused');
        page.firstQuestion.should('not.exist');
    });

    it('does not submit answer question without an answer', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const question = new QuestionBuilder().setAnswer('').build();
        page.inputQuestion(question);
        page.submitQuestion();

        page.answerInput.should('be.focused');
        page.firstQuestion.should('not.exist');
    });

    it('does not reveal answers to closed questions after sorting', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const firstQuestion = new QuestionBuilder()
            .setQuestion('To be or not to be?')
            .setAnswer('To be.')
            .build();
        const questionWithHiddenAnswer = new QuestionBuilder()
            .setQuestion('01. Is the answer hidden?')
            .setAnswer('It should be.')
            .build();
        page.inputQuestion(firstQuestion);
        page.submitQuestion();
        page.inputQuestion(questionWithHiddenAnswer);
        page.submitQuestion();
        page.firstQuestion.click();
        page.sortQuestions();
        
        page.firstAnswer.should('not.be.visible', 'Previously closed question has its answer revealed after sorting. That\'s a bug.');
    });
}

function desktopOnlyCases() {
    it('shows tooltips on questions list title and question maker title', () => {
        const page = new QuestionsPage(cy);
        page.questionsTitle.trigger('mouseover');
        page.questionsTooltip
            .should('be.visible')
            .should(
                'contain.text',
                'Here you can find the created questions and their answers.'
            );
        page.questionMakerTitle.trigger('mouseover');    
        page.questionMakerTooltip
            .should('be.visible')
            .should(
                'contain.text',
                'Here you can create new questions and their answers.'
            );
    });

    it('can be filled and submitted with keyboard controls', () => {
        const page = new QuestionsPage(cy);
        page.removeAllQuestions();
        const question = new QuestionBuilder().build();
        page.questionInput
            .type(question.question)
            .tab()
            .type(question.answer)
            .tab()
            .type('{enter}');
    
        page.firstQuestion
            .should('be.visible')
            .should('contain.text', question.question);
    });
}

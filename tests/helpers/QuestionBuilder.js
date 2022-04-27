import { v4 as uuidv4 } from 'uuid';

class QuestionPair {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }
}

// This builder is of course excessive in the context of questions tests,
// but this is a good practice to create complex test data like this instead of 
// creating typical helpers which end up in tests like 
// const question = createQuestion("what's up", null, null, "it's okay", null, true); 

export class QuestionBuilder {
    constructor() {
        this.questionPair = new QuestionPair();
    }
  
    setQuestion(question) {
        this.questionPair.question = question;
        return this;
    }

    setAnswer(answer) {
        this.questionPair.answer = answer;
        return this;
    }

    build() {
        const uuid = uuidv4();
        if (this.questionPair.question === undefined) this.questionPair.question = uuid + '?';
        if (this.questionPair.answer === undefined) this.questionPair.answer = 'answer to ' + uuid;
        return this.questionPair;
    }
}
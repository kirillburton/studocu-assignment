# QA Engineer test for StuDocu

**For a cloud run:**
see GitHub workflow "Cypress Tests" – create a pull request, add an empty commit or anything else to your taste

[![Cypress Tests](https://github.com/kirillburton/studocu-assignment/workflows/Cypress%20Tests/badge.svg)](https://github.com/kirillburton/studocu-assignment/actions)


**Required to run locally**:
macOS with node v10.3+

**For a local run with a headless browser**:
```
$ npm install
$ npm run test
```

**For a local run with a visible browser**:
```
$ npm install
$ npm start
$ $(npm bin)/cypress open
```
and run questions-page-tests.spec.js by clicking on it.
After a run don't forget to kill the server:
```
$ npm run kill
```

Tests code is [here](https://github.com/kirillburton/studocu-assignment/blob/main/tests/questions-page-tests.spec.js)

## Notes and Insights:
- I've made a simple CI with GitHub Actions + Docker + Cypress. It runs all tests in an isolated environment on any push to a branch. Browser-wise it runs only in Chrome with two viewports for most cases – desktop and mobile. With more time we could do multiple browsers + parallelization; 
- The suite is validly failing because of a behavior that I consider a bug: when you reveal an answer to one question and sort questions afterward, answer is revealed for any question that ends up in that position after sorting;
- I haven't designed any boundary values tests and stuff like that, because that should not be on an e2e regression layer;
- There is a mess with elements locators: using class names or – even worse – xpaths are highly discouraged, we should assign test data attributes to everything we want to test. Or at least use ids. I would try to append them myself if the source code wasn't anonymized;
- The first test ('shows a sample question in default state') is intended to test either default state of the page or previously saved questions depending on our requirements. In our case it's just to check the default question is there;
-  It's a bad practice in tests to depend on data or default behaviour that was not explicitly stated in the tests. Keeping that in mind we'll still use the default question in this assignment – we will accept it as a valid starting state of the page;
- Typially, testing form validations should be on another layer – in component tests for each field and their combinations, but we should test that the whole page state is invalid when a required field is invalid. Even though the only validation right now is 'not empty'. That's why there are tests like: ('does not submit answer without a question') and ('does not submit question without an answer');
- **Important:** I think you should change the way you distribute and request the assignment. Right now because you ask to fork the repo almost anyone can see all public forks with their whole solutions in them. If I would have been a little less honest, I would have definitely used that to my advantage.  


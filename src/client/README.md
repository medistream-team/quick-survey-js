<div align="center">
<img width="600px" alt="Vue.js" src="./logo.png"/> 
</div>

## Quick-Survey-JS is a JavaScript Survey Module.

Quick-Survey-JS offers a quick way to add a simple survey to your website.<br>
It is a set of Vue JS components of creating, completing, and viewing survey questions and results.<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

## Getting Started

Intsall the client side package using npm.

```
npm install quick-survey-js
```

### 1. Set up your api in config.js

Set up `USER_SURVEY_API` and `ADMIN_SURVEY_API` (these names shouldn't change) in your `config.js` that each component would use as required to run the app.
If you need to set up an API server, please visit our git repository [here](https://github.com/medistream-team/quick-survey-js.git).

#### Example

```js
//config.js
export const USER_SURVEY_API = `${VUE_APP_API_ENDPOINTS}/survey`;
export const ADMIN_SURVEY_API = `${VUE_APP_API_ENDPOINTS}/admin/survey`;
```

### 1. Import components in your Vue project

There are 3 components that you may import as needed - to create a survey, submit answers to a survey, and view survey results.
You may import the components on your existing or new application as guided below.

```js
// main.js
import { quickSurveyJS } from 'quick-survey-js';
import 'quick-survey-js/dis/quick-survey-js.css';

Vue.use(quickSurveyJS);

```

### 1. Use components

#### Example

```js
<template>
  <SurveyAdmin @survey-created="onCreated" @failed-to-create-survey="onFailed" />
</template>
```

### 3. Set required props and methods

To get the components working, there are required props to pass each.
The events emitted from each component call the methods where you can specify in your parent component what actions to be taken.
Please refer to below for **required** props and methods.

#### Create Survey

```js
<SurveyAdmin
    :userKey="yourUserKey"
    @survey-created="yourMethod"
    @failed-to-create-survey="yourMethod"
  />

```
`userKey`: used to distinguish general survey respondents, survey creators, and respondents who have already submitted answers.<br>
`survey-created`: Once the survey is created and the submit button is clicked on the browser, this event is emitted. <br>
`failed-to-create-survey`: this event is emitted once it fails to create a survey.

#### Submit Survey

```js
<Survey
    :surveyId="yourSurveyID"
    :userKey="yourUserKey"
    @sent-vote="yourMethod"
    @voted-already="yourMethod"
    @closed-survey="yourMethod"
    @failed-to-close-survey="yourMethod"
  />
```
`surveyID`: Once a survey is created, the surveyId is created - then it can be passed as prop to Survey component which the survey page that general users can view and participate.<br>
`sent-vote`: the event emitted once the user submits an answer.<br>
`voted-already`: the event emitted once it has been confirmed that the user has already voted before. <br>
`closed-survey`: the event emitted once the survey creator chooses to close the survey immediately. <br>
`failed-to-close-survey`: the event emitted once it fails to close the survey.

#### View Survey Results

```js
<SurveyResults
    :surveyId="yourSurveyID"
    :userKey="yourUserKey"
  />
```

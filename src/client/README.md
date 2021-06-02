## Quick-Survey-JS is a JavaScript Survey Module.

Quick-Survey-JS offers a quick way to add a simple survey to your website.<br>
It is a set of Vue JS components of creating, completing, and viewing survey questions and results.<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

## Quick Start

Intsall the client side package using npm.

```
npm install quick-survey-js
```

## Getting Started

### 1. Import components

There are 3 components that you may import as needed - to create a survey, submit answers to a survey, and view survey results.
You may import the components on your existing or new application as guided below.

#### Example

```js
<template>
  <SurveyAdmin @survey-created="onCreated" @failed-to-create-survey="onFailed" />
</template>

<script>
  import SurveyAdmin from "../components/SurveyAdmin";
  ...
</script>
```

### 2. Use components

To get the components working, there are required props to pass each, and methods that you can specify the actions to take in each component.
Please refer to below for **required** props and methods.

#### Create Survey

```js
<SurveyAdmin
		:userKey="yourUserKey"
    @survey-created="yourMethod"
    @failed-to-create-survey="yourMethod"
  />

```

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

#### View Survey Results

```js
<SurveyResults
    :surveyId="yourSurveyID"
    :userKey="yourUserKey"
  />
```

## Features

Node.js, express, serverless framework, VueJS, MongoDB
<br>
## Documentation

[API Document](https://documenter.getpostman.com/view/12457751/TzXukyiL#7e4f1f5e-1643-40df-b94c-374aed364f03)

## Installation

First, you should clone git repository.
```bash
git clone https://github.com/medistream-team/medi-poll.git
```

Then, go to downloaded folder and run `npm install` to download required packages. This command will also install `serverless@2.43.1` globally. When installation is done, `.env` file will be automatically created in a root directory.

```bash
npm install
```

### 1. Set your DB endpoints

You should fill up `MONGO_URI` value inside `.env` file first. MONGO_URI indicates MongoDB server endpoints and this is necessary to run api on whether local or aws lambda.

Here is an example.
```
MONGO_URI=mongodb+srv://test:test123@example.mongodb.net/surveyDB?retryWrites=true&w=majority
```

### 2. Check yml file

Before you run server, you need to configure `service` and `provider` values inside serverless.yml.
Default values are set as below.

```yml
service: my-survey

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region: ap-northeast-2
```

## Open API server
### 1. local api

To run this project on local, use `npm run dev` command.

```bash
npm run dev
```

This command will run serverless offline on your local, and default port 8000 will be opened. 
Here is an example. The `provider[stage]` value you set inside `serverless.yml` will follow the endpoints.
```
localhost:8000/dev
```

### 2. deploy api

Or, to deploy your api on aws lambda via serverless framework, use `npm deploy` command.

```bash
npm run deploy
```

According to serverless documents, the console will show your endpoints. For more information, please visit [this page](https://www.serverless.com/blog/serverless-express-rest-api).

### 3. use endpoints

If you get your api endpoints, you should fill up `API_ENDPOINTS` value inside `.env` file.

## Open client server

```
npm run serve
```

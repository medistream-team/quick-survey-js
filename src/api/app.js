require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const adminRouter = require("./routes/admin");
const surveyRouter = require("./routes/survey");

app.use("/admin", adminRouter);
app.use("/survey", surveyRouter);

module.exports.handler = serverless(app);
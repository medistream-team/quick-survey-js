require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");

const auth = require("./libs/token");

const app = express();

auth.applyTokenMiddleware(app);
app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const adminRouter = require("./routes/admin");
const surveyRouter = require("./routes/survey");
const authRouter = require("./routes/auth");


app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/survey", surveyRouter);

module.exports.handler = serverless(app);
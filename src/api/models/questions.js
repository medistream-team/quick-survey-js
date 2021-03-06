const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Question = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: String,
  description: String,
  isRequired: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  multipleSelectOption: {
    allowed: {
      type: Boolean,
      required: true,
    },
    allowedMin: Number,
    allowedMax: Number,
  },
  participantCount: {
    type: Number,
    required: true,
    default: 0,
  },
  responseCount: {
    type: Number,
    required: true,
    default: 0,
  },
  choices: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      value: {
        type: Number,
        default: null,
      },
      text: {
        type: String,
        default: "",
      },
      responseCount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  minRateDescription: String,
  maxRateDescription: String,
});

module.exports = mongoose.model("Question", Question);

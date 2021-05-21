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
    requiredMin: Number,
    requiredMax: Number,
  },
  choices: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      value: Number,
      text: String,
      count: {
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

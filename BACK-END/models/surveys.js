const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Survey = new Schema({
  creatorKey: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  hasExpiry: {
    type: Boolean,
    required: true,
  },
  closeAt: {
    type: Date,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  pages: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true
      },
      title: String,
      description: String,
      elements: [
        {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Survey", Survey);

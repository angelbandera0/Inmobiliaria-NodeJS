const { Schema, model } = require("mongoose");

const LikeSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  casa: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Casa",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Like", LikeSchema);

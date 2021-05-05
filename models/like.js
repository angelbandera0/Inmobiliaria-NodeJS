const { Schema, model } = require("mongoose");

const LikeSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  planta: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Planta",
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

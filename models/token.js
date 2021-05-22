const { Schema, model } = require("mongoose");

// Declare the Schema of the Mongo model
const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "El id es obligatorio"],
    ref: "User",
  },
  token: {
    type: String,
    required: [true, "El token es obligatorio"],
  },
  createdAt: {
    type: Date,
    required: [true, "El campo createdAt es obligatorio"],
    default: Date.now,
    //2 horas antes de que el token expire y no sea válido
    expires: 7200,
  },
});

module.exports = model("Token", tokenSchema);

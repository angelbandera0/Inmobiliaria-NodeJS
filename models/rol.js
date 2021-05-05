const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Role", RoleSchema);

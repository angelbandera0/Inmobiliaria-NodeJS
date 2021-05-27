const { Schema, model } = require("mongoose");

const CasaVendidaSchema = Schema({
  casa: { type: Schema.Types.ObjectId, ref: "Casa" },

  precioVenta: { type: Number },

  comision: { type: Number },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("CasaVendida", CasaVendidaSchema);

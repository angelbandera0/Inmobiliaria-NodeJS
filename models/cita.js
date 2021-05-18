const { Schema, model } = require("mongoose");

const CitaSchema = Schema({

  fecha: {
    type: Date,
  },

  user: { type: Schema.Types.ObjectId, ref: "User" },

  casa: { type: Schema.Types.ObjectId, ref: "Casa" },

  detallesCita:{ type: String},

  estado:{ type: String, default: "No aprobada"},

  leida:{ type: Boolean, default: false},

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  
});

module.exports = model("Cita", CitaSchema);
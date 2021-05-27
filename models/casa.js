const { Schema, model, Types } = require("mongoose");

const casaSchema = new Schema({
  title: {
    type: String,
    required: [true, "El titlulo es obligatorio"],
    index: true,
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    index: true,
  },
  apellidos: {
    type: String,
    required: [true, "Los apellidos son obligatorios"],
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  img: [{ type: String }],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  description: {
    type: String,
  },

  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],

  citas: [{ type: Schema.Types.ObjectId, ref: "Cita" }],

  numTelefonoPropietario: { type: Number },

  provincia: { type: String },

  municipio: { type: String },

  localidad: { type: String },

  tipoPropiedad: { type: String },

  precio: { type: Number },

  cantBannos: { type: Number },

  cantCuartos: { type: Number },

  tienePatio: { type: Boolean },

  tieneGaraje: { type: Boolean },

  tieneCarpoch: { type: Boolean },

  vendida: { type: Boolean, default: false },
});
casaSchema.methods.toJSON = function () {
  const { __v, ...casa } = this.toObject();
  //se modifica para q salga en los datos en vez de _id salga uid

  return casa;
};
//Export the model
module.exports = model("Casa", casaSchema);

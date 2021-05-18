const { Schema, model, Types } = require("mongoose");

const solicitudSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  img: [{ type: String }],

  estado: { type: String, default: "Pendiente" },

  leida: { type: Boolean, default: false },

  description: { type: String },

  numTelefonoPropietario: { type: Number },

  provincia: { type: String },

  municipio: { type: String },

  localidad: { type: String },

  direccion: { type: String },

  tipoPropiedad: { type: String },

  precio: { type: Number },

  cantBannos: { type: Number },

  cantCuartos: { type: Number },

  tienePatio: { type: Boolean },

  tieneGaraje: { type: Boolean },

  tieneCarpoch: { type: Boolean },
});
solicitudSchema.methods.toJSON = function () {
  const { __v, ...solicitud } = this.toObject();
  //se modifica para q salga en los datos en vez de _id salga uid

  return solicitud;
};
//Export the model
module.exports = model("Solicitud", solicitudSchema);

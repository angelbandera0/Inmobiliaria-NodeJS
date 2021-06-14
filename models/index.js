const Casa = require("./casa");
const CasaVendida = require("./casaVendida");
const Cita = require("./cita");
const Solicitud = require("./solicitud");
const Rol = require("./rol");
const User = require("./user");
const Like = require("./like");
const Token = require("./token");
const RefreshToken = require("./refresh-token.model");


module.exports = {
  Cita,
  Solicitud,
  Casa,
  CasaVendida,
  Rol,
  User,
  Like,
  Token,
  RefreshToken,
};

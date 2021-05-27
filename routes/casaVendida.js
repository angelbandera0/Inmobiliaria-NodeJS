var express = require("express");
const { check } = require("express-validator");
var router = express.Router();

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  getCasasVendidas,
  casaVendidaGetById,
  casaVendidaPut,
  casaVendidaDelete,
} = require("../controllers/casaVendidaController");

router.get("/", getCasasVendidas);

router.get("/:id", casaVendidaGetById);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
  ],
  casaVendidaPut
);

router.delete(
    "/:id",
    [
      validarJWT,
      esAdminRole,
      check("id", "No es un ID válido").isMongoId(),
      validarCampos,
    ],
    casaVendidaDelete
  );

module.exports = router;

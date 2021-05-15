var express = require("express");
const {check}=require("express-validator");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');
const {  existCasaById } = require('../helpers/casas_db_validator');
const { casaPost, casaGet, casaPut, casaDelete, casaGetById, buscar, casaGetUltimas  } = require("../controllers/casaController");

router.get("/", casaGet);

router.get("/ultimas", casaGetUltimas);

router.get("/:id", casaGetById);

router.post("/buscar", buscar);

router.post("/",[
    validarJWT,
    esAdminRole,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos], 
    casaPost);

router.put("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCasaById ),
    validarCampos], 
    casaPut);

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCasaById ),
    validarCampos], 
    casaDelete)

module.exports = router;
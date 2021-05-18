var express = require("express");
const {check}=require("express-validator");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');
const {  existSolicitudById } = require('../helpers/casas_db_validator');
const { solicitudPost, solicitudGet, solicitudPut, solicitudDelete, solicitudGetById  } = require("../controllers/solicitudController");

router.get("/", solicitudGet);

router.get("/:id", solicitudGetById);

router.post("/",[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    validarCampos], 
    solicitudPost);

router.put("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existSolicitudById ),
    validarCampos], 
    solicitudPut);

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existSolicitudById ),
    validarCampos], 
    solicitudDelete)


module.exports = router;
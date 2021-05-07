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
const { casaPost, casaGet, casaPut, casaDelete  } = require("../controllers/casaController");

router.get("/",casaGet);

router.post("/",[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos], 
    casaPost);

router.put("/:id",[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCasaById ),
    validarCampos], 
    casaPut);

router.delete("/:id",[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCasaById ),
    validarCampos], 
    casaDelete)

module.exports = router;
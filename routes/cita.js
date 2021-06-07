var express = require("express");
const {check}=require("express-validator");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');
const {
    citaGet,
    citaGetById,
    citaPost,
    citaPut,
    citaConfirm,
    citaDelete} = require('../controllers/citaController');

router.get("/",[
    validarJWT,
    esAdminRole
],citaGet);

router.get("/:id",[
    validarJWT,
    //esAdminRole
],citaGetById);

router.post("/",[
    validarJWT,    
], citaPost);

router.put("/:id",[
    validarJWT,
    esAdminRole
],citaPut);

router.post("/citaConfirm/:id",[
    validarJWT,
    esAdminRole
],citaConfirm);

router.delete("/:id",[
    validarJWT, 
    esAdminRole   
], citaDelete);

module.exports = router;
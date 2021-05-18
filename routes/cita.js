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
    citaDelete} = require('../controllers/citaController');

router.get("/",citaGet);

router.get("/:id",citaGetById);

router.post("/",[
    validarJWT,    
], citaPost);

router.put("/:id",[
    validarJWT,
    esAdminRole
],citaPut);

router.delete("/:id",[
    validarJWT, 
    esAdminRole   
], citaDelete);

module.exports = router;
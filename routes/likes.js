var express = require("express");
const {check}=require("express-validator");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');
const { isRoleValid, emailExist, existUserById } = require('../helpers/users_db_validator');
const {addLike, removeLike} = require('../controllers/likeController');

router.post("/",[
    validarJWT,    
], addLike);
router.delete("/:id",[
    validarJWT,    
], removeLike);

module.exports = router;

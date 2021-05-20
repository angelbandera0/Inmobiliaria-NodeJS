var express = require("express");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');
const { isRoleValid, emailExist, existUserById } = require('../helpers/users_db_validator');
const {send} = require('../controllers/emailController');

router.get("/send", send);


module.exports = router;

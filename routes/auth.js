const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/");
const {
  login,
  googleSignin,
  confirmAccount,
  resendTokenVerification,
  resetPassword,requestSetPassword
} = require("../controllers/authController");
const { isVerified } = require("../helpers/users_db_validator");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email").custom(isVerified),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "El id_token es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleSignin
);
router.get("/confirmation/:token", confirmAccount);
router.post(
  "/resendemail",
  [check("email", "El correo es obligatorio").isEmail(), validarCampos],
  resendTokenVerification
);
router.post("/resetpassword", resetPassword);
router.post("/requestsetpassword", requestSetPassword);

module.exports = router;

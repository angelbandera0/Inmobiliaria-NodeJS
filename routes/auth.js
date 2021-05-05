const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/');
const { login, googleSignin } = require('../controllers/authController');


const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );



module.exports = router;
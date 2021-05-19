var express = require("express");
const {check}=require("express-validator");
var router = express.Router();

const {
    validarCampos,
    validarJWT,
    esAdminRole,
} = require('../middlewares');
const { emailExist, existUserById } = require('../helpers/users_db_validator');

const { userPost, userGet, userPut,userDelete,userGetById, misAgragaciones } = require("../controllers/userController");

/* Route users listing. */
router.get("/", userGet);

router.get("/:id", userGetById);

router.get("/agragaciones/:id", misAgragaciones);

router.post("/",[
    check('name', 'El nombre es obligatorio').not().isEmpty(),    
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check("email","El correo no es válido").isEmail(),
    check('email').custom( emailExist ),  
    //check('rol').custom( isRoleValid ), 
    validarCampos], userPost);

router.put("/:id",[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    //check('rol').custom( isRoleValid ), 
    validarCampos],
    userPut);

router.delete("/:id",[
    validarJWT,
     esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUserById ),
    validarCampos
], userDelete);

module.exports = router;

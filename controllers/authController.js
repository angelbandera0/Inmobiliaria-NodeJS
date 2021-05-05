const { response } = require("express");
const bcryptjs = require("bcryptjs");

const { User, Rol } = require("../models");

const { generarJWT } = require("../helpers/generar_jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  //obtiene el email y la contraseña q se le envia
  const { email, password } = req.body;
  try {
    // Verificar si el email existe
    const usuario = await User.findOne({ email }).populate("rol");
    if (!usuario) {
      return res.status(400).json({
        msg: "User / Password no son correctos - correo",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).send({
      user: usuario,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignin = async (req, res = response) => {
  console.log(req.body);
  
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);
    let usuario = await User.findOne({ email }).populate("rol");

    if (!usuario) {
      // Tengo que crearlo
      const data = {
        name,
        email,
        password: ":P",
        img,
        google: true,
      };

      usuario = new User(data);
      let newUser = await usuario.save();
      //Buscar el Rol en la DB
      const resRol = await Rol.findById(usuario.rol);
      //Asignar el user al array de user del rol
      resRol.users.push(user);
      //guardar cambios en el rol
      await resRol.save();
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).send({
      user: usuario,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = {
  login,
  googleSignin,
};

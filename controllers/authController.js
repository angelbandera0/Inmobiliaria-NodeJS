const { response } = require("express");
const bcryptjs = require("bcryptjs");

const { User, Rol, Token } = require("../models");

const { generarJWT } = require("../helpers/generar_jwt");
const { googleVerify } = require("../helpers/google-verify");
const { generateRefreshToken, setTokenCookie } = require("../helpers/helper_refresh_token");
const { sendConfirm } = require("./emailController");

const login = async (req, res = response) => {
  //obtiene el email y la contraseña q se le envia
  const { email, password } = req.body;
  const ipAddress = req.ip;
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
    const refreshToken = generateRefreshToken(usuario, ipAddress);
    // save refresh token
    await refreshToken.save();

    setTokenCookie(res, refreshToken.token);

    res.status(200).send({
      user: usuario,
      token: token,
      refreshToken
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
        image: img,
        google: true,
      };

      usuario = new User(data);
      let newUser = await usuario.save();
      //Buscar el Rol en la DB
      const resRol = await Rol.findById(usuario.rol);
      //Asignar el user al array de user del rol
      resRol.users.push(newUser);
      //guardar cambios en el rol
      await resRol.save();
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);
    const refreshToken = generateRefreshToken(usuario, ipAddress);
    // save refresh token
    await refreshToken.save();

    setTokenCookie(res, refreshToken.token);

    res.status(200).send({
      user: usuario,
      token: token,
      refreshToken
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

const confirmAccount = async (req, res = response) => {
  try {
    const { token } = req.query;
    const tokenCF = await Token.findOne({ token });
    let link;
    if (process.env.NODE_ENV === "development") {
      link = process.env.FRONT_URL_DEV;
    }
    if (process.env.NODE_ENV === "production") {
      link = process.env.FRONT_URL_PROD;
    }
    if (!tokenCF) {
      res.status(401).send({
        type: "not-verified",
        msg: "No se ha podido encontrar un token válido. Su token puede que haya expirado.",
      });
    }
    const user = await User.findById(tokenCF.userId);
    if (!user) {
      global.io.emit("confirm", { msg: false });
      return res.status(400).send({
        type: "not-user",
        msg: "No hemos encontrado un usario para este token.",
      });
    }
    if (user.isVerified) {
      global.io.emit("confirm", { msg: true });
      return res.status(400).send({
        type: "already-verified",
        msg: "This user has already been verified.",
      });
    }
    // Verify and save the user
    user.isVerified = true;
    await user.save();
    global.io.emit("confirm", { msg: true });

    res.redirect(`${link}/auth/confirmaccount/${user._id}?email=${user.email}`);
    /*res
      .status(200)
      .send(
        "La cuenta ha sido verificada correctamente. Por favor inicie sesión."
      );*/
  } catch (error) {
    global.io.emit("confirm", { msg: false });

    res.status(400).send({
      type: "error-inesperado",
      msg: "Ha ocurrido un error inesperado.",
    });
  }
};

const resendTokenVerification = async (req, res = response) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  console.log(user);

  if (!user)
    return res
      .status(400)
      .send({ msg: "No hemos encontrado un usario para este token." });
  if (user.isVerified)
    return res
      .status(400)
      .send({ msg: "This user has already been verified." });
  const salt = bcryptjs.genSaltSync();
  const token = new Token({
    userId: user,
    token: bcryptjs.hashSync(`${user.name}${Date.now()}`, salt),
  });

  let link;
  if (process.env.NODE_ENV === "development") {
    link = process.env.BACK_URL_DEV;
  }
  if (process.env.NODE_ENV === "production") {
    link = process.env.FRONT_URL_PROD;
  }

  const cuerpoCorreo = {
    subject: "Token de Verificación de Cuenta",
    text:
      "Hola " +
      user.name +
      ",\n\n" +
      "Por favor verifica tu cuenta haciendo click sobre este link: " +
      link +
      "/api/auth/confirmation?token=" +
      token.token +
      ".\n",
  };

  const resToken = await token.save();
  sendConfirm(user, cuerpoCorreo);

  res.status(201).send({
    msg: "Se ha reenviado el token exitosamente.",
  });
};

const resetPassword = async (req, res = response) => {
  const { token } = req.query;
  const { password } = req.body;
  let user = await User.findOne({ passwordHash: token });
  if (!user) {
    throw new Error("Invalid password reset token");
  }

  const salt = bcryptjs.genSaltSync();
  const hash = bcryptjs.hashSync(password, salt);

  const userUpdated = await User.updateOne(
    { passwordHash: token },
    { $set: { password: hash } },
    { new: true }
  );

  res.status(200).send({
    user: userUpdated,
  });
};

const requestSetPassword = async (req, res = response) => {
  try {
    const { email } = req.body;
    console.log(email);

    const user = await User.findOne({ email });
    console.log(user);
    // Generar Hash
    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(`${user.name}${Date.now()}`, salt);

    //Establecer hash
    await User.updateOne(
      { email: email },
      { $set: { passwordHash: hash } },
      { new: true }
    );
    //url link
    let link;
    if (process.env.NODE_ENV === "development") {
      link = process.env.FRONT_URL_DEV;
    }
    if (process.env.NODE_ENV === "production") {
      link = process.env.FRONT_URL_PROD;
    }

    //envio del correo
    const cuerpoCorreo = {
      subject: "Cambio de contraseña",
      text:
        "Hola " +
        user.name +
        ",\n\n" +
        "Por favor, para cambiar la contraseña dar click sobre este link: \n" +
        link +
        "/auth/changepassword?token=" +
        hash +
        ".\n",
    };
    console.log(hash);
    sendConfirm(user, cuerpoCorreo);
    res.status(201).send({
      msg: "Se ha enviado el email de cambio de contraseña correctamente. Revice su correo.",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      msg: "Ha ocurrido un error al solicitar el email de cambio de contraseña.",
    });
  }
};

module.exports = {
  login,
  googleSignin,
  confirmAccount,
  resendTokenVerification,
  resetPassword,
  requestSetPassword,
};

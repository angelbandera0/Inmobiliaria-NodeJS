const { response } = require("express");
const bcryptjs = require("bcryptjs");

const { User, Rol, Token } = require("../models");

const { generarJWT } = require("../helpers/generar_jwt");
const { googleVerify } = require("../helpers/google-verify");
const { sendConfirm } = require("./emailController");

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
const confirmAccount = async (req, res = response) => {
  try {
    const { token } = req.params;
    const tokenCF = await Token.findOne({ token });
    if (!tokenCF) {
      res.status(401).send({
        type: "not-verified",
        msg: "No se ha podido encontrar un token válido. Su token puede que haya expirado.",
      });
    }
    const user = await User.findById(tokenCF.userId);
    if (!user)
      return res.status(400).send({
        type: "not-user",
        msg: "No hemos encontrado un usario para este token.",
      });
    if (user.isVerified)
      return res.status(400).send({
        type: "already-verified",
        msg: "This user has already been verified.",
      });
    // Verify and save the user
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .send(
        "La cuenta ha sido verificada correctamente. Por favor inicie sesión."
      );
  } catch (error) {
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
  const resToken = await token.save();
  sendConfirm(req, user, token);

  res.status(201).send({
    msg: "Se ha reenviado el token exitosamente.",
  });
};

const resetPassword = async (req, res = response) => {
  const { token } = req.params;
  let passwordResetToken = await Token.findOne({ token });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const salt = bcryptjs.genSaltSync();
  const hash = bcryptjs.hashSync(password, salt);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: token.userId });
  
  await passwordResetToken.deleteOne();
  
  const resToken = await generarJWT(user.id);

  res.status(200).send({
    user: user,
    token: resToken,
  });
  
};

module.exports = {
  login,
  googleSignin,
  confirmAccount,
  resendTokenVerification,
  resetPassword
};

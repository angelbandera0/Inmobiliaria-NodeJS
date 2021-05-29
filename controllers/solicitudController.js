const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const {
  subidaImagenCloudinary,
  actualizarImagenCloudinary,
  eliminarImagenCloudinary,
} = require("./subidasController");
const { sendConfirm } = require("./emailController");
const { casaPost } = require("./casaController");
const { Solicitud, User } = require("../models");

const solicitudGet = async (req = request, res = response) => {
  const { estado } = req.query;
  const [total, solicitudes] = await Promise.all([
    Solicitud.countDocuments({ estado: estado }),
    Solicitud.find({ estado: estado }).sort({ createdAt: -1 }).populate("user"),
  ]);

  res.status(200).send({
    total: total,
    solicitudes: solicitudes,
  });
};

const solicitudGetById = async (req = request, res = response) => {
  const { id } = req.params;
  const solicitud = await Solicitud.findById(id).populate("user");

  res.status(200).send({
    solicitud: solicitud,
  });
};

//Agregar Solicitud
const solicitudPost = async (req, res = response) => {
  try {
    const { ...data } = req.body;
    const urlImage = "";
    if (req.files != null) {
      const urlImage = await subidaImagenCloudinary(req.files.archivo);
    }
    const solicitud = new Solicitud(data);
    solicitud.img = urlImage;

    solicitud.user = req.usuario;
    // Guardar en BD
    const resSolicitud = await solicitud.save();

    //Buscar el User en la DB
    const resUser = await User.findById(resSolicitud.user);

    //Asignar la solicitud al usuario
    resUser.solicitudes.push(solicitud);
    //guardar cambios en el user
    await resUser.save();

    res.status(201).send({
      solicitud: solicitud,
      msg: "Solicitud creada correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error al adicionar" });
  }
};

//Editar o Actualizar Solicitud
const solicitudPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  try {
    //Buscar y actualizar

    const solicitud = await Solicitud.findById(id);

    if (req.files != null) {
      //const urlImg = await actualizarImagenCloudinary(req.files.archivo.tempFilePath,solicitud.img);
      const urlImg = await actualizarImagenCloudinary(
        req.files.archivo,
        solicitud.img
      );
      resto.img = urlImg;
    }
    //actualiza la fecha de actualización
    resto.updatedAt = Date.now();

    await solicitud.update(resto);

    res.status(200).send({
      solicitud: solicitud,
      msg: "Solicitud Actualizada Correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la actualizacón" });
  }
};

//Eliminar Solicitud
const solicitudDelete = async (req, res = response) => {
  const { id } = req.params;

  try {
    //Fisicamente lo borramos
    const resp = await Solicitud.findByIdAndRemove(id);
    eliminarImagenCloudinary(resp.img);

    const user = await User.findById(resp.user);
    const cuerpoCorreo = {
      subject: "Publicación denegada",
      text: "Su solicitud para publicar su anuncio ha sido denegada",
    };
    sendConfirm(user, cuerpoCorreo);

    /*
    //Eliminar Solicitud asociada a usuario
    //Buscar el User en la DB
    const resUser = await User.findById(resp.user);
    
    let pos = resUser.solicitudes.indexOf(resp._id);
    
    let elementoEliminado = resUser.solicitudes.splice(pos, 1);
    
    //guardar cambios en el user 
    await resUser.save();
    */
    res.status(200).send({ msg: "Solicitud eliminada correctamente" });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la eliminación" });
  }
};

const solicitudConfirm = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await Solicitud.findById(id);
    console.log(solicitud);
    solicitud.estado = "Aprobada";
    await solicitud.save();
    //Enviar notificacion al correo
    const user = await User.findById(solicitud.user);
    const cuerpoCorreo = {
      subject: "Publicación aceptada",
      text: "Su solicitud para publicar su anuncio ha sido aceptada",
    };
    sendConfirm(user, cuerpoCorreo);
    casaPost(req, res);
  } catch (e) {
    console.log(e);
    res.status(400).send({
      msg: "Ha ocurrido un error",
    });
  }
};

module.exports = {
  solicitudPost,
  solicitudGet,
  solicitudPut,
  solicitudDelete,
  solicitudGetById,
  solicitudConfirm,
};

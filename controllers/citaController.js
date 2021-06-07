const { request, response } = require("express");
const { User, Casa, Cita } = require("../models");
const { sendConfirm } = require("./emailController");
const mongoose = require("mongoose");

const citaGet = async (req = request, res = response) => {
  const { estado } = req.query;
  const [total, citas] = await Promise.all([
    Cita.countDocuments({ estado: estado }),
    Cita.find({ estado: estado }) 
      .sort({ createdAt: -1 })
      .populate("casa")
      .populate("user"),
  ]);

  res.status(200).send({
    total,
    citas,
  });
};

const citaGetById = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario } = req;
  let cita;

  if (usuario.rol.rol !== "ADMIN_ROLE") {
    cita = await Cita.findById(id).populate("casa").populate("user");
  } else {
    cita = await Cita.findOneAndUpdate(
      { _id: id },
      { leida: true },
      {
        new: true,
      }
    )
      .populate("casa")
      .populate("user");
  }

  res.status(200).send({
    cita,
  });
};

const citaPost = async (req = request, res = response) => {
  const { idCasa } = req.body;
  const idUser = req.usuario._id;

  try {
    //registra la nueva cita
    //crear la nuevo cita
    const newCita = new Cita({
      casa: mongoose.Types.ObjectId(idCasa),
      user: mongoose.Types.ObjectId(idUser),
    });
    //add cita
    const resp = await newCita.save();

    //update userCitas and casaCitas
    const [a, b] = await Promise.all([
      User.updateOne({ _id: idUser }, { $push: { citas: resp._id } }),
      await Casa.updateOne({ _id: idCasa }, { $push: { citas: resp._id } }),
    ]);
    //retorna los valores
    res.status(200).send({ cita: resp });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ msg: "Ha ocurrido un error a la hora de crear la cita", e });
  }
};

const citaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, ...data } = req.body;
  try {
    console.log(id);
    const cita = await Cita.findByIdAndUpdate(id, data);

    res.status(200).send({ cita });
  } catch (e) {
    res
      .status(400)
      .send({ msg: "Ha ocurrido un error a la hora de actualizar la cita", e });
  }
};

const citaDelete = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const cita = await Cita.findByIdAndDelete(id);

    const user = await User.findById(cita.user);
    const cuerpoCorreo = {
      subject: "Solicitud de cita denegada",
      text: "En estos momentos no es posible agendar nuevas citas",
    };
    sendConfirm(user, cuerpoCorreo);

    res.status(200).send({ msg: "Casa eliminada correctamente" });
  } catch (e) {
    res.status(400).send({ msg: "Error", e });
  }
};

const citaConfirm = async (req = request, res = response) => {
  const { subject, text, fecha } = req.body;
  const { id } = req.params;

  try {
    const cita = await Cita.findById(id);
    cita.estado = "Aprobada";
    cita.fecha = fecha;
    cita.detallesCita = text;
    await cita.save();

    const user = await User.findById(cita.user);
    const cuerpoCorreo = {
      subject: subject,
      text: text,
    };
    sendConfirm(user, cuerpoCorreo);

    res.status(200).send({ msg: "La cita ha sido agendada" });
  } catch (e) {
    res.status(400).send({ msg: "Error", e });
  }
};

module.exports = {
  citaGet,
  citaGetById,
  citaPost,
  citaPut,
  citaDelete,
  citaConfirm,
};

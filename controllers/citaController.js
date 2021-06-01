const { request, response } = require("express");
const { User, Casa, Cita } = require("../models");
const { sendConfirm } = require("./emailController");

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
  const cita = await Cita.findById(id).populate("casa").populate("user");

  if (!cita.leida) {
    cita.leida = true;
  }
  res.status(200).send({
    cita,
  });
};

const citaPost = async (req = request, res = response) => {
  const { idCasa } = req.body;
  const idUser = req.usuario._id;

  try {
    const [casa, user] = await Promise.all([
      Casa.findById(idCasa),
      User.findById(idUser),
    ]);
    //registra la nueva cita
    const newCita = new Cita({ casa, user });
    const resp = await newCita.save();
    //console.log(resp);
    //actualiza las citas del user y la casa
    casa.citas.push(resp);
    user.citas.push(resp);
    console.log("fgsdddddddshdshshhhhhhhhhtrrthwhtrw");
    await casa.save();
    await user.save();
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

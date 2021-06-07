const { request, response } = require("express");
const { User, Casa, Like } = require("../models");
const mongoose = require("mongoose");
//agrega un like
const addLike = async (req = request, res = response) => {
  try {
    const { idCasa } = req.body;
    const idUser = req.usuario._id;
    //crear el nuevo like
    const newLike = new Like({
      casa: mongoose.Types.ObjectId(idCasa),
      user: mongoose.Types.ObjectId(idUser),
    });
    //add like
    const resp = await newLike.save();

    //update userLikes and casaLikes
    const [a, b] = await Promise.all([
      User.updateOne({ _id: idUser }, { $push: { myLikes: resp._id } }),
      await Casa.updateOne({ _id: idCasa }, { $push: { likes: resp._id } }),
    ]);

    //envio de respuesta
    res.status(200).send({ like: resp });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ msg: "Ha ocurrido un error a la hora de dar un like" });
  }
};

//elimina el like
const removeLike = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    //elimina el like
    const resp = await Like.findByIdAndDelete(id);

    //actualiza el dichos modelos retirando el like q fue eliminado
    Promise.all([
      Casa.updateOne(
        { _id: resp.casa._id },
        { $pull: { likes: mongoose.Types.ObjectId(id) } },
        { multi: true }
      ),
      User.updateOne(
        { _id: resp.user._id },
        { $pull: { myLikes: mongoose.Types.ObjectId(id) } },
        { multi: true }
      ),
    ]);

    //retorna los valores
    res.status(200).send({ like: resp });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ msg: "Ha ocurrido un error a la hora de remover el like." });
  }
};

module.exports = {
  addLike,
  removeLike,
};

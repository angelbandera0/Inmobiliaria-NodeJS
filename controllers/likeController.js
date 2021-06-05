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
      await Casa.updateOne({ _id: idUser }, { $push: { likes: resp._id } }),
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
  const { id } = req.params;
  //elimina el like
  const resp = await Like.findByIdAndDelete(id);

  //busca la planta y el user q tenia ese like
  const casa = await Casa.findById(resp.casa);
  const user = await User.findById(resp.user);

  //actualiza el dichos modelos retirando el like q fue eliminado
  casa.likes.pull(resp);
  user.myLikes.pull(resp);
  await casa.save();
  await user.save();
  //Promise.all([casa.save(), user.save()]);

  //retorna los valores
  res.status(200).send({ like: resp });
};

module.exports = {
  addLike,
  removeLike,
};

const { request, response } = require("express");
const { User, Planta, Like } = require("../models");

//agrega un like
const addLike = async (req = request, res = response) => {
  const { idPlanta, idUser } = req.body;

  //busca el user y la planta
  const [planta, user] = await Promise.all([
    Planta.findById(idPlanta),
    User.findById(idUser),
  ]);
  //registra el nuevo like
  const newLike = new Like({ planta, user });
  const resp = await newLike.save();
  //actualiza los likes del user y la planta
  planta.likes.push(resp);
  user.myLikes.push(resp);
  Promise.all([planta.save(), user.save()]);
  //retorna los valores
  res.status(200).send({ like: resp });
};

//elimina el like
const removeLike = async (req = request, res = response) => {
  const { id } = req.params;
  //elimina el like
  const resp = await Like.findByIdAndDelete(id);
  
  //busca la planta y el user q tenia ese like
  const planta = await Planta.findById(resp.planta);
  const user = await User.findById(resp.user);

  //actualiza el dichos modelos retirando el like q fue eliminado
  planta.likes.pull(resp);
  user.myLikes.pull(resp);
  Promise.all([planta.save(), user.save()]);
  
  //retorna los valores
  res.status(200).send({ like: resp });
};

module.exports = {
  addLike,
  removeLike,
};

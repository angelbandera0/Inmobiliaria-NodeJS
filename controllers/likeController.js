const { request, response } = require("express");
const { User, Casa, Like } = require("../models");

//agrega un like
const addLike = async (req = request, res = response) => {
  const { idCasa, idUser } = req.body;

  //busca el user y la planta
  const [casa, user] = await Promise.all([
    Casa.findById(idCasa),
    User.findById(idUser),
  ]);
  //registra el nuevo like
  const newLike = new Like({ casa, user });
  const resp = await newLike.save();
  //actualiza los likes del user y la planta
  casa.likes.push(resp);
  user.myLikes.push(resp);
  Promise.all([casa.save(), user.save()]);
  //retorna los valores
  res.status(200).send({ like: resp });
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
  Promise.all([casa.save(), user.save()]);
  
  //retorna los valores
  res.status(200).send({ like: resp });
};

module.exports = {
  addLike,
  removeLike,
};

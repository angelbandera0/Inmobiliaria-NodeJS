const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { subidaImagenCloudinary, actualizarImagenCloudinary, eliminarImagenCloudinary } = require("./subidasController");
const { Casa } = require("../models");

const casaGet = async (req = request, res = response) => {
  const [total, casas] = await Promise.all([
    Casa.countDocuments(),
    Casa.find(),
  ]);

  res.status(200).send({
    total: total,
    casas: casas,
  });
};
//Agregar Casa
const casaPost = async (req, res = response) => {

  try {
    const {
        name,
        description,
        cuidados,
        isConMaceta,
        isPersonalizable,
      } = req.body;

    const urlImage = await subidaImagenCloudinary(
      req.files.archivo.tempFilePath
    );
    const image = urlImage;
    const casa = new Casa({
      name,
      image,
      description,
      cuidados,
      isConMaceta,
      isPersonalizable,
    });

    // Guardar en BD

    await casa.save();

    res.status(201).send({
      casa: casa,
      msg: "Casa creada correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error al adicionar" });
  }
};

//Editar o Actualizar Casa
const casaPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  try {
    //Buscar y actualizar
    const casa = await Casa.findById(id);    
    const urlImg = await actualizarImagenCloudinary(req.files.archivo.tempFilePath,casa.image);
    resto.image=urlImg;
    console.log(resto);
    await casa.update(resto);
    

    res.status(200).send({
      casa: casa,
      msg: "Casa Actualizada Correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la actualizacón" });
  }
};

//Eliminar Casa
const casaDelete = async (req, res = response) => {
  const { id } = req.params;

  try {
    //Fisicamente lo borramos
    const resp = await Casa.findByIdAndRemove(id);
    eliminarImagenCloudinary(resp.image);

    res.status(200).send({ msg: "Casa eliminada correctamente" });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la eliminación" });
  }
};

module.exports = { casaPost, casaGet, casaPut, casaDelete };

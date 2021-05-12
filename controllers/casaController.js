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
    const {  ...data  } = req.body;

    const urlImage = await subidaImagenCloudinary(
      req.files.archivo.tempFilePath
    );
    const img = urlImage;
    const casa = new Casa(  data  );
    casa.img = img;

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
    //const planta = await Planta.findByIdAndUpdate(id, resto);
    const casa = await Casa.findById(id);
    if(req.files != null){    
    const urlImg = await actualizarImagenCloudinary(req.files.archivo.tempFilePath,casa.img);
    resto.img=urlImg;
    }
    
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
    eliminarImagenCloudinary(resp.img);

    res.status(200).send({ msg: "Casa eliminada correctamente" });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la eliminación" });
  }
};

module.exports = { casaPost, casaGet, casaPut, casaDelete };

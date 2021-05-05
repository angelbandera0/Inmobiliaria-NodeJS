const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { subidaImagenCloudinary, actualizarImagenCloudinary, eliminarImagenCloudinary } = require("./subidasController");
const { Planta } = require("../models");

const plantaGet = async (req = request, res = response) => {
  const [total, plantas] = await Promise.all([
    Planta.countDocuments(),
    Planta.find(),
  ]);

  res.status(200).send({
    total: total,
    plantas: plantas,
  });
};
//Agregar Planta
const plantaPost = async (req, res = response) => {

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
    const img = urlImage;
    const planta = new Planta({
      name,
      img,
      description,
      cuidados,
      isConMaceta,
      isPersonalizable,
    });

    // Guardar en BD

    await planta.save();

    res.status(201).send({
      planta: planta,
      msg: "Planta creada correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error al adicionar" });
  }
};

//Editar o Actualizar Planta
const plantaPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, ...resto } = req.body;

  try {
    //Buscar y actualizar
    //const planta = await Planta.findByIdAndUpdate(id, resto);
    const planta = await Planta.findById(id);    
    const urlImg = await actualizarImagenCloudinary(req.files.archivo.tempFilePath,planta.img);
    resto.img=urlImg;
    console.log(resto);
    await planta.update(resto);
    

    res.status(200).send({
      planta: planta,
      msg: "Planta Actualizada Correctame",
    });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la actualizacón" });
  }
};

//Eliminar Planta
const plantaDelete = async (req, res = response) => {
  const { id } = req.params;

  try {
    //Fisicamente lo borramos
    const resp = await Planta.findByIdAndRemove(id);
    eliminarImagenCloudinary(resp.img);

    res.status(200).send({ msg: "Planta eliminada correctamente" });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la eliminación" });
  }
};

module.exports = { plantaPost, plantaGet, plantaPut, plantaDelete };

const { request, response, query } = require("express");
const bcryptjs = require("bcryptjs");
const {
  subidaImagenCloudinary,
  actualizarImagenCloudinary,
  eliminarImagenCloudinary,
} = require("./subidasController");
const { Casa, User, CasaVendida } = require("../models");

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

const casaGetUltimas = async (req = request, res = response) => {
  const [total, casas] = await Promise.all([
    Casa.countDocuments(),
    Casa.find().sort({ createdAt: -1 }).limit(Number(10)),
  ]);

  res.status(200).send({
    total: total,
    casas: casas,
  });
};

const casaGetById = async (req = request, res = response) => {
  const { id } = req.params;
  const casa = await Casa.findById(id);

  res.status(200).send({
    casa: casa,
  });
};

//Agregar Casa
const casaPost = async (req, res = response) => {
  
  try {
    const { ...data } = req.body;

    const urlImage = await subidaImagenCloudinary(req.files.archivo);

    const casa = new Casa(data);
    casa.img = urlImage;

    casa.user = req.usuario;

    // Guardar en BD
    const resCasa = await casa.save();

    //Buscar el User en la DB
    const resUser = await User.findById(resCasa.user);
    //Asignar al usuario la casa
    resUser.casas.push(casa);
    //guardar cambios en el user
    await resUser.save();

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
    if (req.files != null) {
      const urlImg = await actualizarImagenCloudinary(
        req.files.archivo,
        casa.img
      );
      resto.img = urlImg;
    }
    //actualiza la fecha de actualización
    resto.updatedAt = Date.now();

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

const casaBuscar = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    
    const [total, casas] = await Promise.all([
      Casa.countDocuments(req.body),
      Casa.find(req.body)
          .skip(Number(desde))
          .limit(Number(limite)),
    ]);
  
    res.status(200).send({
      total: total,
      casas: casas,
    });
                   
  } catch (e) {
    res.status(400).send({
      Error: e,
    });
  }
};

const casaVender = async ( req, res = response) => {
  const { id } = req.params;
  const { precioVenta }  = req.body
  try{
    const resCasa = await Casa.findById(id);
    resCasa.vendida = true;
    await resCasa.save();
    const comision = precioVenta*5/100;
    
    const data = {
      casa : id,
      precioVenta,
      comision,
    }
    const casaVendida = new CasaVendida(data);
    await casaVendida.save();

    res.status(200).send({ casaVendida});
  }catch(e){
    res.status(400).send({ msg : "Error", e});
  }
}

module.exports = {
  casaPost,
  casaGet,
  casaPut,
  casaDelete,
  casaGetById,
  casaBuscar,
  casaGetUltimas,
  casaVender,
};

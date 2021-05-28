const { request, response } = require("express");
const { CasaVendida, Casa } = require("../models");

const getCasasVendidas = async (req, res) => {
  const [total, casas] = await Promise.all([
    CasaVendida.countDocuments(),
    CasaVendida.find().populate("casa"),
  ]);

  res.status(200).send({
    total: total,
    casas: casas,
  });
};

const casaVendidaGetById = async (req = request, res = response) => {
  const { id } = req.params;
  const casa = await CasaVendida.findById(id).populate("casa");

  res.status(200).send({
    casa: casa,
  });
};

const casaVendidaPut = async ( req, res) => {
    const { id } = req.params;
    const {_id, ...data } = req.body;
    try{
        data.updatedAt = Date.now();
        const casa = await CasaVendida.findByIdAndUpdate( id , data);
        res.status(200).send({
            casa
        })
    }catch(e){
        res.status(400).send({
            msg : "Algo salio mal"
        })
    }
}

const casaVendidaDelete = async (req = request, res = response) => {
    const { id } = req.params;
    try{
        const resCasa = await CasaVendida.findByIdAndDelete(id);
        const casa = await Casa.findById(resCasa.casa);
        casa.vendida = false;
        await casa.save();
        res.status(200).send({
            msg : "Eliminada correctamente"
        })
    }catch(e){
        res.status(400).send({
            msg : "Algo salio mal"
        })
    }
}

module.exports = {
  getCasasVendidas,
  casaVendidaGetById,
  casaVendidaPut,
  casaVendidaDelete
};

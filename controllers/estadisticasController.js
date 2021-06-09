const { request, response } = require("express");
const { Solicitud, Cita } = require("../models");

const cantPendientes = async ( req, res = response) => {

    const [totalSol, totalCitas] = await Promise.all([
        Solicitud.countDocuments({ estado: 'Pendiente' }),
        Cita.countDocuments({ estado: 'Pendiente' }),
      ]);

    res.status(200).send({
        totalSol,
        totalCitas,
    })
};

module.exports = {
    cantPendientes,
};
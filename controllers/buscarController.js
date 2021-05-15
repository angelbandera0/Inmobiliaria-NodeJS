const { response } = require('express');

const coleccionesPermitias = [
    
]

const buscar = ( req, res = response ) =>{

    const { coleccion, termino } = req.params;

    res.json({
        coleccion, 
        termino
    })
}

module.exports = {
    buscar
}
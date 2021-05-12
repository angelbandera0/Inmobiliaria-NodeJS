const {Casa, Solicitud} = require("../models")

const existCasaById = async( id ) => {
    // Verificar si el correo existe
    const existeCasa = await Casa.findById(id);
    if ( !existeCasa ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


const existSolicitudById = async( id ) => {
    // Verificar si el correo existe
    const existeSolicitud = await Solicitud.findById(id);
    if ( !existeSolicitud ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


module.exports = { existCasaById, existSolicitudById };
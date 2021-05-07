const {Casa} = require("../models")

const existCasaById = async( id ) => {
    // Verificar si el correo existe
    const existeCasa = await Casa.findById(id);
    if ( !existeCasa ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

module.exports = { existCasaById };
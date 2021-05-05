const Role = require('../models/rol');
const User = require('../models/user');

const isRoleValid = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExist = async( email='') => {
    // Verificar si el correo existe
    const existeEmail = await User.findOne({ email });
    if ( existeEmail ) {
        throw new Error(`El email: ${ email }, ya está registrado`);
    }
}

const existUserById = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await User.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    isRoleValid,
    emailExist,
    existUserById
}


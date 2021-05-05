const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        console.log(uid);
        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid ).populate('rol');

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }
        
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}
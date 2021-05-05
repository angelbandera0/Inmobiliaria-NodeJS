const { response } = require('express')

//verifica q el user sea admin role
const esAdminRole = ( req, res = response, next ) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, name } = req.usuario;
    
    if ( rol.rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } no es administrador - No puede hacer esto`
        });
    }

    next();
}

//pergunta si posee algun rol
const tieneRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.usuario.rol.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}
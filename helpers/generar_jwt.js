const jwt = require('jsonwebtoken');

//genera un token de seguridad
const generarJWT = ( uid = '' ) => {
    return new Promise( (resolve, reject) => {
        
        //se guarda en payload la informacion q se va a guardar en el token
        const payload = { uid };

        //genera el token a partir del payload y de una secrectkey
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            //fecha de expiración 
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                //devuelve el token creado
                resolve( token );
            }
        })

    })
}




module.exports = {
    generarJWT
}


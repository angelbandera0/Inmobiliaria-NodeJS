const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const { Planta, User } = require("../models");


const subidaImagenCloudinary = async(tempFilePath) => {
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );   
    return secure_url;
}


const actualizarImagenCloudinary = async(tempFilePath,modeloImageUrl) => {      
    // Limpiar imágenes previas
    if ( modeloImageUrl ) {
        const nombreArr = modeloImageUrl.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
    }    
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    return secure_url;

}

const eliminarImagenCloudinary = async(modeloImageUrl) => {
    if ( modeloImageUrl ) {
        const nombreArr = modeloImageUrl.split('/');
        const nombre    = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
       return await cloudinary.uploader.destroy( public_id );
    }
}


module.exports={
    subidaImagenCloudinary,
    actualizarImagenCloudinary,
    eliminarImagenCloudinary
}
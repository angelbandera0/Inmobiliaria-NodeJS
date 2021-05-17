const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
const { Planta, User } = require("../models");

/*
const subidaImagenCloudinary = async(tempFilePath) => {
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );   
    return secure_url;
}
*/

const subidaImagenCloudinary = async(archivos) => {
    
    const urlArrary = [];

    if(archivos[0] == null){
        const { secure_url } = await cloudinary.uploader.upload( archivos.tempFilePath );   
        return secure_url;

    }
    else{
        for (let archivo of archivos ) {
            const { secure_url } = await cloudinary.uploader.upload( archivo.tempFilePath ); 
            urlArrary.push(secure_url);
            //console.log(urlArrary);
        }
        return urlArrary;  
    }
}

const actualizarImagenCloudinary = async(archivos,modeloUrlArray) => {      
    
    const urlArray = [];

    // Limpiar imágenes previas
    if ( modeloUrlArray ) {
        for (const modeloImageUrl of modeloUrlArray) {
            const nombreArr = modeloImageUrl.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );    
        }
    }   
    if(archivos[0] == null){
        const { secure_url } = await cloudinary.uploader.upload( archivos.tempFilePath );   
        return secure_url;

    } 
    for (const archivo of archivos) {
        const { secure_url } = await cloudinary.uploader.upload(archivo.tempFilePath );  
        urlArray.push(secure_url);  
    }
    
    return urlArray;

}

const eliminarImagenCloudinary = async(modeloUrlArray) => {
    if ( modeloUrlArray ) {
        for (const modeloImageUrl of modeloUrlArray) {
            const nombreArr = modeloImageUrl.split('/');
            const nombre    = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            await cloudinary.uploader.destroy( public_id );    
        }
        
    }
}


module.exports={
    subidaImagenCloudinary,
    actualizarImagenCloudinary,
    eliminarImagenCloudinary
}
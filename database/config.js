const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONDODB_ATLAS_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        console.log('Conectado exitosamente a MongoDB Altas');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}

module.exports = {
    dbConnection
}

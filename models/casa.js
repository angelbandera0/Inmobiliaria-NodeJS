const {Schema,model}=require("mongoose");

// Declare the Schema of the Mongo model
const casaSchema = new Schema({
    municipio:{
        type:String,
        required:[true,'El municipio es obligatorio'],
        index:true,
    },
    image:{
        type:String,
        //required:[true,'La contraseña es obligatoria'],
        
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
    
});

//Export the model
module.exports = model('Casa', casaSchema);
const {Schema,model,Types}=require("mongoose");

const casaSchema = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        index:true,
    },
    img:{
        type:String,
    },
    description:{
        type:String,
    },
    cantLikes:{
        type:Number,
        default: 0
    },
    provincia:{    type:String },
    
    municipio:{    type:String },
    
    localidad:{    type:String },
    
    tipoPropiedad:{    type:String },
    
    precio:{    type:String },
    
    cantCuartos:{    type:Number },
});
casaSchema.methods.toJSON = function() {
    const { __v, ...casa  } = this.toObject();
    //se modifica para q salga en los datos en vez de _id salga uid

    return casa;
}
//Export the model
module.exports = model('Casa', casaSchema);
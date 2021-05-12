const {Schema,model,Types}=require("mongoose");

const solicitudSchema = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        index:true,
    },
    aplellido:{
        type:String,
        required:[true,'Los apellidos son obligatorios'],
        index:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },

    img: [{ type: String }],

    estado:{    type:String },

    description:{    type:String },

    numTelefono:{    type:Number },

    provincia:{    type:String },
    
    municipio:{    type:String },
    
    localidad:{    type:String },

    direccion:{    type:String },
    
    tipoPropiedad:{    type:String },
    
    precio:{    type:String },
    
    cantCuartos:{    type:Number },
});
solicitudSchema.methods.toJSON = function() {
    const { __v, ...solicitud  } = this.toObject();
    //se modifica para q salga en los datos en vez de _id salga uid

    return solicitud;
}
//Export the model
module.exports = model('Solicitud', solicitudSchema);
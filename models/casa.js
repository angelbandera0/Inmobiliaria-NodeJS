const {Schema,model,Types}=require("mongoose");

const casaSchema = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        index:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    },
    
    img: [{ type: String }],

    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
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
    
    cantBannos:{    type:Number },

    cantCuartos:{    type:Number },

    tienePatio:{   type:Boolean},
    
    tieneGaraje:{   type:Boolean},
    
    tieneCarpoch:{   type:Boolean},
});
casaSchema.methods.toJSON = function() {
    const { __v, ...casa  } = this.toObject();
    //se modifica para q salga en los datos en vez de _id salga uid

    return casa;
}
//Export the model
module.exports = model('Casa', casaSchema);
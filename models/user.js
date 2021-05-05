const {Schema,model,Types}=require("mongoose");

// Declare the Schema of the Mongo model
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        index:true,
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria'],
        
    },
    email:{
        type:String,
        required:[true,'El email es obligatorio'],
        unique:true,
    },
    rol:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'Role',
        default: Types.ObjectId("4edd40c86762e0fb12000001")
    },
    myLikes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    img: {
        type: String,
    },
    //campo para decir si el user se unió usando google o no
    google: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }

    
});
userSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user  } = this.toObject();
    //se modifica para q salga en los datos en vez de _id salga uid
    user.uid = _id;
    return user;
}
//Export the model
module.exports = model('User', userSchema);
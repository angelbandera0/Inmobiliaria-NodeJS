const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { subidaImagenCloudinary, actualizarImagenCloudinary, eliminarImagenCloudinary } = require("./subidasController");
const { User,Rol } = require('../models');

//obtener listado de usuarios de forma paginada
//limite y desde son parametros pasados por la url
const userGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find()
        .populate("role")
        .skip(Number(desde))
        .limit(Number(limite)),
  ]);

  res.status(200).send({
    total: total,
    users: users,
  });
};


const userGetById = async (req = request, res = response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  
  res.status(200).send({
    user: user,
  });
};

const misAgregaciones = async (req = request, res = response) => {
  const { id } = req.params;
  const user = await User.findById(id)
                         .populate('solicitudes')
                         .populate('casas')
                         .populate('citas');

  
  res.status(200).send({
    user,
    userSolicitudes: user.solicitudes ? user.solicitudes : [],
    userCasas: user.casas ? user.casas : [],
    userCitas: user.citas ? user.citas : [],        
  });
}


//Agregar Usuario
const userPost = async (req, res = response) => {
  const { name, password, email} = req.body;
  console.log(req);
  try {
    
    //Subir la imagen al Cloudinary
    const urlImage = await subidaImagenCloudinary( req.files.archivo);
    const image = urlImage;
    
    const user = new User({ name, password, email, image });
    
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    
    // Guardar en DB
    const resU = await user.save();
    //Buscar el Rol en la DB
    const resRol = await Rol.findById(resU.rol);
    //Asignar el user al array de user del rol
    resRol.users.push(user);
    //guardar cambios en el rol 
    await resRol.save();  

    res.status(201).send({
      msg: "Usuario creado correctamente",
      user: resU,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ msg: "Ha ocurrido un error al adicionar" });
  }
};

//actualiza un usuario
const userPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, email, createdAt,rol, ...resto } = req.body;

  try {
    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }
    //actualiza la fecha de actualización
    resto.updatedAt = Date.now();

    const user = await User.findById(id);

    //Actualizar imagen en Cloudinary
    const urlImg = await actualizarImagenCloudinary(req.files.archivo,user.image);
    resto.image=urlImg;

    //actualizar usuario
    await user.update(resto);


    //Buscar y actualizar
    //await User.findByIdAndUpdate(id, resto);
    
    res.status(200).send({ msg: "User Actualizado Correctame" });
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la actualizacón" });
  }
};

//elimina un usuario
const userDelete = async (req, res = response) => {
  const { id } = req.params;
  
  try {
    
    //Fisicamente lo borramos
    const resp = await User.findByIdAndRemove(id);
    
    //Eliminamos la imagen de Cloudinary  
    eliminarImagenCloudinary(resp.image);

    res.status(200).send({ msg: "Usuario eliminado Correctamente" });
  
  } catch (e) {
    res.status(400).send({ msg: "Ha ocurrido un error en la eliminación" });
  }
};

module.exports = { userPost, userGet, userPut, userDelete,userGetById, misAgregaciones };

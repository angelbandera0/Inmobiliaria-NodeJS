const { request, response } = require("express");
const { Rol } = require('../models');

//agrega los roles de los usuarios
const initRolesDB = async () => {

  //busca los roles  
  const roles = await Rol.find();
  //comprueba q no existan o este vacía la colle
  if (!roles || roles.length == 0) {
    //crea una instancia para cada rol
    const roleAdmin = new Rol({ rol: "ADMIN_ROLE" });
    const roleUser = new Rol({ rol: "USER_ROLE" });

    //define los ObjectId de manera fija
    const _ida = mongoose.Types.ObjectId("4edd40c86762e0fb12000002");//role admin
    const _idu = mongoose.Types.ObjectId("4edd40c86762e0fb12000001");//role user

    //actualiza los roles con los nuevos ObjectId
    roleAdmin._id = _ida;
    roleUser._id = _idu;

    //registra los roles en la DB
    roleAdmin.save();    
    roleUser.save();
    console.log("Roles agregados y cargados exitosamente");
  } else {
    console.log("Roles cargados exitosamente");
  }
};
module.exports = { initRolesDB };


const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");


//Obtener usuarios
const userGet = async (req = request, res = response) => {
  /* const {q, nombre = 'No Name', apikey = '12313131', page = 1, limit} = req.query */

  const { limit = 20, desde = 0 } = req.query;
  //Get all users


  //Compaginate
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({state:true}),
    Usuario.find({state:true})
    .skip(Number(desde))
    .limit(Number(limit))
  ])

  res.json({
    total,
    usuarios,
  });
};


//Actualizar usuarios
const userPut = async (req, res = response) => {
  const id = req.params.id;
  const { _id, password, google, correo, ...resto } = req.body;

  //Validar en DB
  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "put API Controller",
    usuarioDB,
  });
};


//Crear usuario
const userPost = async (req, res = response) => {
  //Show response from post req
  const { nombre, correo, password, role } = req.body;
  const usuario = new Usuario({ nombre, correo, password, role });

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();

  res.json({
    msg: "post API Controller",
    usuario,
  });
};

//Borrar usuarios
const userDelete = async (req, res = response) => {
  
  const { id } = req.params;
  
  
  const usuario = await Usuario.findByIdAndUpdate( id, {state: false} );
  const usuarioAutenticado = req.usuario
  
  res.json({
    msg: 'Se ha borrado con exito el usuario: ',
    usuario,
    usuarioAutenticado,    
  });


}

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
};

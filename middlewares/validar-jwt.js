const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

  const token = req.header('x-token');

  
  if(!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion'
    });
  }

  try {
    
    const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
  
    // leer el usuario logueado
    const usuario = await Usuario.findById( uid );

    if( !usuario ) {
      return res.status(401).json({
        msg: 'token no válido - Usuario no existe en DB'
      })
    }

    //Verificar usuario activo
    if ( !usuario.state ) {
      return res.status(401).json({
        msg: 'Token no válido - usuario Inactivo'
      })
    }
    
    
    
    
    req.usuario = usuario;
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    })
    
  }





}


module.exports = {
  validarJWT
}
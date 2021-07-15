const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si Email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Correo",
      });
    }

    //Verificar Usuario activo
    if (!usuario.state) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - E° False",
      });
    }

    //Verificar Password
    const validatePassword = bcryptjs.compareSync(password, usuario.password);
    if (!validatePassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Pw",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: 'Login Exitoso',
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};


//Google controlador
const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;


    try {
      //Destructuracion de usuario de google
      const {correo, nombre, img} = await googleVerify( id_token );

      let usuario = await Usuario.findOne({ correo });
      if(!usuario){
        const data = {
          nombre,
          correo,
          password: 'chupalo',
          img,
          google: true
        };
        //Crear usuario
        usuario = new Usuario( data );
        //Guardar usuario en DB
        await usuario.save();
      }

      //Si el usuario esta eliminado en DB
      if(!usuario.state) {
        return res.status(401).json({
          msg: 'Usuario bloqueado/eliminado. Contactar al administrador'
        });
      }

      //Generar el JWT
      const token = await generarJWT( usuario.id );

      
      res.json({
        msg: 'Autentificacion correcta con Google',
        usuario,
        token
      })
    } catch (err) {
      res.status(400).json({
        msg: 'Token de Google invalido',
      })
    }



}

module.exports = {
  login,
  googleSignIn
};

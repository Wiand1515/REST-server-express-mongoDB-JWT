const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

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

module.exports = {
  login,
};

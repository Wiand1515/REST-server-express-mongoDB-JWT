const Role = require('../models/role');
const Usuario = require('../models/usuario')

const esRoleValido = async ( role = '' ) => {
    const existeRol = await Role.findOne({role});
    if (! existeRol) {
        throw new Error(`El rol ${role}, no se encuentra registrado en nuestra DB. Favor contactar a administrador`)
    }
} 

const emailExiste = async (correo = '') => {
    const existeCorreo = await Usuario.findOne( {correo} );
    if( existeCorreo ) {
        throw new Error(`El correo ${correo}, ya se encuentra registrado en la DB`)
    }
}

const existeUsuarioPorId = async( id ) => {

    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId

}





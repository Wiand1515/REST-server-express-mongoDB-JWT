const Role = require('../models/role');
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


//Validar Rol
const esRoleValido = async ( role = '' ) => {
    const existeRol = await Role.findOne({role});
    if (! existeRol) {
        throw new Error(`El rol ${role}, no se encuentra registrado en nuestra DB. Favor contactar a administrador`)
    }
} 

//Validar Email
const emailExiste = async (correo = '') => {
    const existeCorreo = await Usuario.findOne( {correo} );
    if( existeCorreo ) {
        throw new Error(`El correo ${correo}, ya se encuentra registrado en la DB`)
    }
}

//Validar Usuario
const existeUsuarioPorId = async( id ) => {

    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//Validar Categoria
const existeCategoriaPorId = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if(!existeCategoria) {
        throw new Error('No existe la Categoria')
    }
}

//Validar Producto
const existeProductoPorId = async ( id ) => {
    const existeProducto = await Producto.findById( id );
    if(existeProducto) {
        throw new Error('No existe el producto')
    }
}

//Validar colecciones
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    
    const existe = colecciones.includes(coleccion);

    if(!existe) {
        throw new Error('No es una coleccion Valida')
    }

    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}





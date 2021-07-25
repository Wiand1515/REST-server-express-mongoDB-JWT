const { response } = require("express");
const {ObjectId} = require('mongoose').Types;
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {

    //Validar busqueda por id
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:  (usuario) ? [usuario] : [] 
        })
    }

    
    //Expresion regular para no considerar case sensitive
    const regex = new RegExp( termino, 'i' );
    
    //Buscar por nombre y correo
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, {correo: regex}],
        $and: [{state: true}]
    });
    res.json({
        results: usuarios
    });




}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias
    })
}

const buscarProductos = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre');

    res.json({
        results: productos
    })
}

const buscar = (req,res = response) => {

    const {coleccion, termino} = req.params;

    if( !coleccionesPermitidas.includes( coleccion )) {
        res.status(400).json({
            msg: 'No es una coleccion permitida'
        })
    }

    switch (coleccion) {
       case 'usuarios':
        buscarUsuarios(termino,res);
           break;
        case 'categorias':
        buscarCategorias(termino, res);
            break;
        case 'productos':
        buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Olvide realizar esta busqueda'
            })
    }

}

module.exports = {
    buscar
}
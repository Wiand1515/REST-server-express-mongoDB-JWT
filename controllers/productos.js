const { response, request } = require('express');
const Producto = require('../models/producto')

//Obtener Productos
const obtenerProductos = async (req, res) => {
    const {limit = 20, desde = 0} = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true}).
        populate('categoria', 'nombre').
        populate('usuario', 'nombre').
        skip(Number(desde)).
        limit(limit)
    ])

    res.json({
        total,
        productos
    })
}

//Obtener Producto
const obtenerProducto = async(req, res) => {
    const {id} = req.params;
    const producto = await Producto.findById( id ).
    populate('categoria', 'nombre').
    populate('usuario', 'nombre')

    res.json({
        producto
    })
}

// Crear Producto
const crearProducto = async( req = request , res = response ) => {

    const {estado, usuario, ...body} = req.body


    const productoDB = await Producto.findOne({nombre : body.nombre.toUpperCase()});

    if(productoDB) {
        return res.status(400).json({
            msg: `El Producto ${productoDB.nombre} ya existe en la DB`
        })
    }

    //Crear datos a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar en DB

    await producto.save();

    res.status(201).json(producto)


}

//Actualizar Producto
const actualizarProducto = async(req, res) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario_id;

    const producto = await Producto.findOneAndUpdate(id, data, {new:true})
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre');

    res.json( producto )
}

//Borrar Producto
const borrarProducto = async(req, res) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false});
    const productoEliminado = req.usuario.nombre;

    res.json({
        msg: 'Se ha eliminado con exito el producto',
        producto,
        productoEliminado
    })
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    crearProducto,
    borrarProducto

}
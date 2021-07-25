const {response, request} = require('express');
const { Categoria } = require('../models')


// ObtenerCategorias - Paginado - Total - Populate(Moongose)
const catGet = async ( req = request, res = response ) => {
    const {limit = 20, desde = 0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado: true})
        ,
        Categoria.find({estado:true}).
        populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limit))
    ])

    res.json({
        total,
        categorias
    })
}


//ObtenerCategoria - Populate {}
const catGetSingle = async (req = request, res= response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById( id ).
    populate('usuario', 'nombre')

    res.json({
        categoria
    })
}








//Crear categoria
const crearCategoria = async (req = request, res = response) => {
 
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    
    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }

    //Crear data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardar en DB
    await categoria.save();

    res.status(201).json( categoria )

}


//actualizar Categoria 
const actualizarCategoria = async(req = request, res = response) => {
   
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id , data , {new:true});

    res.json( categoria);
} 



//Borrar Categoria
const catDelete = async (req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false});
    const eliminadoPorUsuario = req.usuario.nombre;

    res.json({
        msg: 'Se ha eliminado con exito la categoria',
        categoria,
        eliminadoPorUsuario
    })
}



module.exports = {
    crearCategoria,
    catGet,
    catGetSingle,
    actualizarCategoria,
    catDelete
}
const path = require('path')
const fs = require('fs')
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivos");
const Producto = require("../models/producto");
const Usuario = require("../models/usuario");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)



const cargarArchivo = async(req, res = response) => {
    //Validar si existe un archivo en al peticion
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).json({msg: 'No hay archivos en la peticion para subir'});
      return;
    }
  

    try {
        const nombre = await subirArchivo(req.files, undefined,'imgs');
        res.json({
            nombre
        })
        
        
    } catch (err) {
        res.status(400).json({err})
        
    }

}

const actualizarImagen = async (req, res = response) => { //Local
    //Validar si existe un archivo en al peticion
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg: 'No hay archivos en la peticion para subir'});
        return;
    }

    const {id, coleccion} = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe el usuario'
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: 'No existe el producto'
                });
            }
            break;
    
        default:
           return res.status(500).json({msg: 'No he validado esto'})
    }

    //Eliminar imagenes previas
    
        if(modelo.img){
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen)
            }
        }

    //Grabar en DB
    const nombre = await subirArchivo(req.files, undefined,coleccion);
    modelo.img = nombre

    await modelo.save();

    

    res.json({
        modelo
    })
}

const mostrarImagen = async (req, res=response) => {

    const {id, coleccion} = req.params

let modelo;

switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
            return res.status(400).json({
                msg: 'No existe el producto'
            });
        }
        break;
    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo) {
            return res.status(400).json({
                msg: 'No existe el producto'
            });
        }
        break;

    default:
       return res.status(500).json({msg: 'No he validado esto'})
}

//Eliminar imagenes previas

    if(modelo.img){
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
           return res.sendFile(pathImagen)
        }
    }

const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
res.sendFile(pathImagen)
}

const actualizarImagenCloudinary = async (req, res = response) => {
    //Validar si existe un archivo en al peticion
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg: 'No hay archivos en la peticion para subir'});
        return;
    }
    //Destructuracion de parametros 
    const {id, coleccion} = req.params
    let modelo;

    //Validar colecciones validas por ID
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe el usuario'
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: 'No existe el producto'
                });
            }
            break;
    
        default:
           return res.status(500).json({msg: 'No he validado esto'})
    }

    //Eliminar imagenes previas
    
        if(modelo.img){
            const nombreArr = modelo.img.split('/');
            const nombre =nombreArr[ nombreArr.length -1 ];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy( public_id);
        }
    

    //Subir a cloudinary
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath);

    //Grabar en DB
    modelo.img = secure_url;
    await modelo.save();

    
    //Respuesta 
    res.json({
        modelo
    })
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
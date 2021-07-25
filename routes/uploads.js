const {Router} = require('express');
const {check} = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const {validarCampos} = require('../middlewares/validate-camp')


const router = Router();


router.post('/', cargarArchivo);

router.put('/:coleccion/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( (coleccion) => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
],actualizarImagenCloudinary)

router.get('/:coleccion/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( (coleccion) => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)



module.exports = router
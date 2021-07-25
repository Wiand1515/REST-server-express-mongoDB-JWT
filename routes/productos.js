const {Router} = require('express');
const {check} = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const {validarJWT} = require('../middlewares/validar-jwt');
const { adminRole } = require('../middlewares/validar-role');
const {validarCampos} = require('../middlewares/validate-camp');

const router = Router();

//Todos los productos - Publico
router.get('/', obtenerProductos);

//Obtener producto - Publico
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos
],obtenerProducto);

//Crear un nuevo producto - Privado - Cualquier Rol
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,    
] ,crearProducto);

//Actualizar Producto - Privado - Cualquier Rol
router.put('/:id',[
    validarJWT,
    check('categoria', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar Producto - Admin
router.delete('/:id',[
    validarJWT,
    adminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto)












module.exports = router
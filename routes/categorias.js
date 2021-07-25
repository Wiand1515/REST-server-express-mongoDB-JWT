const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validate-camp');
const {validarJWT} = require('../middlewares/validar-jwt');
const { crearCategoria, catGet, catGetSingle,catDelete, actualizarCategoria } = require('../controllers/categorias');
const { tieneRoles, adminRole } = require('../middlewares/validar-role');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();





//Todas las categorias - Publico
router.get('/', catGet);

//Obtener una categoria - Publico
router.get('/:id',[
    check('id', 'No es un id Valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], catGetSingle
);


//Crear una nueva categoria - Privado Cualquier rol
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar un registro - Privado Cualquier rol
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligarotio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria)

//Borrar Categoria - Admin
router.delete('/:id',[
    validarJWT,
    adminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], catDelete)



module.exports = router;
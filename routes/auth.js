const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validate-camp');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login )

router.post('/google',[
    check('id_token', 'el id_token es ').not().isEmpty(),
    validarCampos
], googleSignIn) 








module.exports = router;
const { Router } = require("express");
const { check } = require("express-validator");
const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { adminRole, tieneRoles } = require("../middlewares/validar-role");
const { validarCampos } = require("../middlewares/validate-camp");

const router = Router();

//Peticion GET
router.get("/", userGet);

//Peticion PUT
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  userPut
);

//Peticion POST
router.post(
  "/",
  [
    /* Validaciones */
    check("correo", "El correo no es valido").isEmail(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es debe contener mas de 6 letras").isLength({
      min: 6,
    }),
    /* check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), */
    //Validacion rol contra DB
    /* Con ES6 esta f(x) queda => solo esRoleValido, puesto que la funcion recibe el mismo parametro que se envia  */
    check("role").custom((rol) => esRoleValido(rol)),
    check("correo").custom(emailExiste),
    validarCampos,
  ],
  userPost
);

//Peticion DELETE
router.delete(
  "/:id",
  [
    validarJWT,
    /* adminRole, */
    tieneRoles('ADMIN_ROLE','USER_ROLE','PERRO_ROLE'),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  userDelete
);

module.exports = router;

const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'Este campo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

//Por scope debe ser una funcion normal para referencias de manera correcta THIS
UsuarioSchema.methods.toJSON = function () {
    const {__v, password, _id, ...user } = this.toObject();
    user.uid = _id
    return user;
}

module.exports = model('Usuario', UsuarioSchema);
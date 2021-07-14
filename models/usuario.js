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
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

//Por scope debe ser una funcion normal para referencias de manera correcta THIS
UsuarioSchema.methods.toJSON = function () {
    const {__v, password, ...user } = this.toObject();
    return user;
}

module.exports = model('Usuario', UsuarioSchema);
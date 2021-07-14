const {Schema, model} = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'el rol es obligatorio'],
    }
});




module.exports = model('Role', RoleSchema)
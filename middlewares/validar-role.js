const { request, response } = require("express")


const adminRole = (req = request, res = response, next) => {

    if(!req.usuario){
        return  res.status(500).json({
            msg: 'Se quiere verificar el role sin validar token'
        })
    }

    const { role, nombre } = req.usuario;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `el usuario ${nombre}, no es administrador`
        })
    }



    next();
}

const tieneRoles = ( ...roles ) => {

    
    return (req = request, res = response, next) => {
        
        console.log(roles, req.usuario.role)
        
        //Validacion de token
        if(!req.usuario){
            return  res.status(500).json({
                msg: 'Se quiere verificar el role sin validar token'
            })
        }

        if ( !roles.includes( req.usuario.role ) ) {
            return res.status(401).json({
                msg: 'Rol no valido para realizar esta accion'
            })
        } 

        
        next();
    }

}

module.exports = {
    adminRole,
    tieneRoles
}
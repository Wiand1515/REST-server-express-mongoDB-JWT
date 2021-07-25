const express = require("express");
const cors = require("cors");
const { dbConnect } = require("../database/config");
const fileUpload = require('express-fileupload')

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //Available routes
    this.paths = {
      auth: "/api/auth",
      buscar:     '/api/buscar',
      categorias: "/api/categorias",
      usuarios: "/api/users",
      productos: "/api/productos",
      uploads:    '/api/uploads',
      
    };

    //DB Connect
    this.conectDB();

    //MIDDLEWARES => f(X) que añaden funcionalidad a mi webserver:
    this.middlewares();

    //Rutas de mi app:
    this.routes();
  }

  //Middlewares Methods:
  middlewares() {
    //CORS
    this.app.use(cors());

    //Public dir.
    this.app.use(express.static("public"));

    //Read and Body Parse
    this.app.use(express.json());

    //Carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
  }));
  }

  //DB
  async conectDB() {
    await dbConnect();
  }

  //Routes Methods:
  routes() {
    //Usamos este middleware para configurar nuestras rutas en otro archivo
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));    
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require('../routes/productos'));    
    this.app.use(this.paths.uploads, require('../routes/uploads'));
    
    
    
  }

  //Port Listen Method:
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}

module.exports = Server;

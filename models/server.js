const express = require("express");
const cors = require("cors");
const { dbConnect } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //Available routes
    this.usuariosPath = "/api/users";

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
  }

  //DB
  async conectDB() {
    await dbConnect();
  }

  //Routes Methods:
  routes() {
    //Usamos este middleware para configurar nuestras rutas en otro archivo
    this.app.use(this.usuariosPath, require("../routes/user"));
  }

  //Port Listen Method:
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto: ${this.port}`);
    });
  }
}

module.exports = Server;

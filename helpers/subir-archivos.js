const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivo = (
  files,
  extensionesPermitidas = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    //Extraer el nombre del archivo
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];


    //Validar archivo
    if(archivo === undefined){
      return reject('Debe tener un archivo')
    }

    //Validar extension
    if (!extensionesPermitidas.includes(extension)) {
      return reject("No es una extension permitida");
    }

    //Renombrar Archivo
    const nombreTemporalArchivo = uuidv4() + "." + extension;

    //Subir Archivo

    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      nombreTemporalArchivo
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(nombreTemporalArchivo);
    });
  });
};

module.exports = {
  subirArchivo,
};

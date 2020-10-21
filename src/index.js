// Importar express
const express = require('express');

// Importar conexion a la base de datos
const conectarDB = require('./config/db');

// Importar body-parser
const bodyParser = require('body-parser');

// Importar las rutas v1
const routesv1 = require('./routes/v1');

// Crear la aplicacion de express
const app = express();

//Habilitar body-parser para application x-www.form-url-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Para usar un application/json
app.use(bodyParser.json());

// Iniciamos las routes para la version v1
routesv1(app);

// Definir el puerto de escucha, ahora se recoge de la variable de entorno
const PORT = process.env.PORT || 4000;

// Realizar conexion a la DB
conectarDB();

app.listen(PORT, () => {
    console.log(`El Servidor esta corriendo en el puerto ${PORT}`);
  });



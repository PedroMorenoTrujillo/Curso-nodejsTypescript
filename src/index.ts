/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Importar express
import express, { Application, Request } from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar body-parser
import bodyParser from 'body-parser';

// Importar las rutas v1
import routesv1 from './routes/v1';
// dotenv.config({ path: 'variables.env' });
dotenv.config({ path: 'variables.env' });

declare global{
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express{
    // eslint-disable-next-line no-shadow
    export interface Request{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sessionData: any;
    }
  }
}

// Crear la aplicacion de express
const app: Application = express();

// Habilitar body-parser para application x-www.form-url-encoded
app.use(bodyParser.urlencoded({ extended: false }));

// Para usar un application/json
app.use(bodyParser.json());

// Iniciamos las routes para la version v1
routesv1(app);

// Definir el puerto de escucha, ahora se recoge de la variable de entorno
const PORT: number | string = process.env.PORT || 4000;

// Realizar conexion a la DB
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('DB conectada');
  } catch (error) {
    console.log(error);
    process.exit(1); // Detener la app
  }
};

conectarDB();

app.listen(PORT, () => {
  console.log(`El Servidor esta corriendo en el puerto ${PORT}`);
});

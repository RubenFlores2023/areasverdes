// SELECCIONAR UN TEMA 

// Desarrollar un módulo de registro de productos para llevar el control de los plantines existentes en el vivero.


//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// ruta
const plantaRutas = require('./rutas/plantaRutas');

// configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB\
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

//utilizar las rutas de recetas
app.use('/plantas', plantaRutas);
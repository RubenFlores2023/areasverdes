const mongoose = require('mongoose');
//definir el esquema
const plantaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    especie: String,
    categoria: String,
    porte: String,
    cantidad: Number,
    precio:Number
});

const PlantaModel = mongoose.model('Planta',plantaSchema, 'planta');
module.exports = PlantaModel;
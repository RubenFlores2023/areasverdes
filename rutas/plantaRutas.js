const express = require('express');
const rutas = express.Router();
const PlantaModel = require('../models/Planta');

//endpoint 1 traer todas las recetas
rutas.get('/getPlantas', async (req, res) => {
    try  {
        const planta = await  PlantaModel.find();
        res.json(planta);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2. Crear
rutas.post('/crear', async (req, res) => {
    const { especie } = req.body;

    try {
        const plantaExistente = await PlantaModel.findOne({ especie });

        if (plantaExistente) {
            return res.status(400).json({ mensaje: 'Ya existe una planta con esta especie.' });
        }
        const planta = new PlantaModel({
            especie: req.body.especie,
            categoria: req.body.categoria,
            porte: req.body.porte,
            cantidad: req.body.cantidad,
            precio: req.body.precio
        });

        const nuevaPlanta = await planta.save();
        res.status(201).json(nuevaPlanta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const plantaEditada = await PlantaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!plantaEditada)
            return res.status(404).json({ mensaje : 'Receta no encontrada!!!'});
        else
            return res.json(plantaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})


//Endpoint 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const eliminarplanta = await PlantaModel.findByIdAndDelete(req.params.id);
       if (!eliminarplanta)
            return res.status(404).json({ mensaje : 'Registro de Planta no encontrada!!!'});
       else 
            return res.json({mensaje :  'Planta Eliminada'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - Endpoint 5. buscar planta por su ID
rutas.get('/planta/:id', async (req, res) => {
    try {
        const planta = await PlantaModel.findById(req.params.id);
        if (!planta)
            return res.status(404).json({ mensaje : 'Planta no encontrada!!!'});
        else 
            return res.json(planta);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

// - Endpoint 6 Filtrar Plantas por categoria

rutas.get('/categoria/:categoria', async (req, res) => {
    try {
        const bcategoria = req.params.categoria.toLowerCase(); 
        const plantas = await PlantaModel.find({ categoria: { $regex: bcategoria, $options: 'i' }});

        if (plantas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron Plantas en esa categoria.' });
        }
        return res.json(plantas);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});


// - Endpoint 7 contar la cantidad de plantas existentes
rutas.get('/cantidadTotalPlantas', async (req, res) => {
    try {
        const resultado = await PlantaModel.aggregate([
            {
                $group: {
                    _id: null,
                    cantidadTotal: { $sum: '$cantidad' } // Suma el campo 'cantidad' de todos los documentos
                }
            }
        ]);
        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron plantas en la base de datos.' });
        }
        res.json({ cantidadTotalPlantas: resultado[0].cantidadTotal });
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});


// - Endpoint 8 contar el numero total de Plantas por especies
rutas.get('/totalplantas', async (req, res) => {
    try {
        const total = await PlantaModel.countDocuments();
        const especies = await PlantaModel.distinct('especie');
        return res.json({ totalPlantas: total, cantidadEspecies: especies.length, especies });
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - Endpoint 9 Busca plantas por especies
rutas.get('/especie/:especie', async (req, res) => {
    try {
        const especieBuscada = req.params.especie.toLowerCase(); 
        const plantas = await PlantaModel.find({ especie: { $regex: especieBuscada, $options: 'i' }});

        if (plantas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron plantas de esa especie.' });
        }
        return res.json(plantas);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - Endpoint 10 Busqueda de plantines por el porte
rutas.get('/porte/:porte', async (req, res) => {
    try {
        const porteBuscado = req.params.porte.toLowerCase(); 
        const resultado = await PlantaModel.aggregate([
            { $match: { porte: { $regex: porteBuscado, $options: 'i' }}}, 
            { $group: { _id: "$especie", cantidadTotal: { $sum: "$cantidad" }}} 
        ]);

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron plantas con ese porte.' });
        }
        
        const especies = resultado.map(item => item._id);
        const cantidadTotal = resultado.reduce((total, item) => total + item.cantidadTotal, 0);

        return res.json({ cantidadTotal, especies });
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// - Endpoint 11 Ordenar registro por Ascendente o Descendente
rutas.get('/ordenar', async (req, res) => {
    try {
        const plantas = await PlantaModel.find().sort({ especie: 1 });
        res.json(plantas);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});


module.exports = rutas;




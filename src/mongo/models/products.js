// Modelo para productos
// Importar mongoose
const mongoose = require('mongoose')

// Destructuring para usar Schema solamente
const { Schema } = mongoose;

// Crear el Schema con mongoose para usuarios
const productSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    images: {type: [{ type: String, required: true }], default: []},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {
    timestamps: true
});

// Crear variable del modelo
const model = mongoose.model('Product', productSchema);
// Exportar
module.exports = model;
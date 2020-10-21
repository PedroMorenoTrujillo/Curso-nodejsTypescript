// Modelo para usuarios
// Importar mongoose
const mongoose = require('mongoose')

// Destructuring para usar Schema solamente
const { Schema } = mongoose;

// Crear el Schema con mongoose para usuarios
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    data: {
        type: {
            age: Number,
            isMale: true
        }
    },
    role: {
        type: String,
        enum: ['admin', 'seller'],
        default: 'seller'
    }
});

// Crear variable del modelo
const model = mongoose.model('User', userSchema);
// Exportar
module.exports = model;
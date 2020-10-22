// Modelo para usuarios
// Importar modulos de mongoose
import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document{
    username: string;
    password: string;
    email: number;
    data: {
        age: number;
        isMale: boolean;
    };
    role: string;
}

// Crear el Schema con mongoose para usuarios
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  data: {
    type: {
      age: Number,
      isMale: true,
    },
  },
  role: {
    type: String,
    enum: ['admin', 'seller'],
    default: 'seller',
  },
});

// Crear variable del modelo y exportar
export default model<IUser>('User', userSchema);

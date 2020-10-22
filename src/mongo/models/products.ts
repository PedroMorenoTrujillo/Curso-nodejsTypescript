// Modelo para productos
// Importar modulos de mongoose
import { Document, model, Schema } from 'mongoose';

// Importar la interfaz IUser
import { IUser } from './users';

export interface IProduct extends Document{
    title: string;
    desc: string;
    price: number;
    images: string[];
    user: IUser | string;
}

// Crear el Schema con mongoose para usuarios
const productSchema: Schema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [{ type: String, required: true }], default: [] },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

// Crear variable del modelo y exportar
export default model<IProduct>('Product', productSchema);

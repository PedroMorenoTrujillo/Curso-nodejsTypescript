/* eslint-disable max-len */
// Importar modulos de express
import { Request, Response } from 'express';

// Importar modelo de Productos
import Products from '../../mongo/models/products';

// Crea Producto
const createProduct = async (req: Request, res:Response): Promise<void> => {
  try {
    // Destructuring para asignar valores de la peticion
    const {
      title, desc, price, images, userId,
    } = req.body;
    // Crear el producto
    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId,
    });

    // Respuesta
    res.send({ status: 'Ok', data: product });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

// Borrar Producto
// const deleteProduct = (req: Request, res: Response): void => { };

// Obtener Productos
const getProducts = async (req: Request, res:Response): Promise<void> => {
  try {
    /* Con populate traemos los datos del usuario (el segundo parametro son los campos del usuario que elegimos traer)
    y con select los campos del producto que queremos traer */
    const products = await Products.find({
      price: { $gt: 10 }, // Filtrando por precio superior a 10
    }).populate('user', 'username email email data role').select('title desc price');
    // Respuesta
    res.send({ status: 'Ok', data: products });
  } catch (error) {
    console.log(`createProduct error: ${error}`);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

// Traer productos de un usuario especifico
const getProductsByser = async (req:Request, res:Response): Promise<void> => {
  try {
    const products = await Products.find({
      user: req.params.userId,
    });
    // Respuesta
    res.send({ status: 'Ok', data: products });
  } catch (error) {
    console.log(`createProduct error: ${error}`);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

export default {
  createProduct, getProducts, getProductsByser,
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
// Importar modulos de express
import { Request, Response } from 'express';

// Importar JWT
import jwt from 'jsonwebtoken';

// Importar bcrypt
import bcrypt from 'bcrypt';
// Importar modelo de Users

import Users from '../../mongo/models/users';

// Importar modelo de Productos
import Products from '../../mongo/models/products';

// Tiempo de expiracion del token
const expiresIn = 3600;

// Pasar rondas del salt
const salt = 15;

// Metodo para login
const login = async (req:Request, res:Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      // Generando el jwt
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn });
      // Comprobar la contraseña
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        res.send({ status: 'Ok', data: [user, token] });
      } else {
        res.status(403).send({ status: 'INVALID PASSWORD', message: 'La contraseña no es correcta' });
      }
    } else {
      res.status(401).send({ status: 'USER NOT FOUND', message: 'No existe el usuario' });
    }
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

// Crea Usuario
const createUser = async (req:Request, res:Response): Promise<void> => {
  try {
    // Obtener datos del usuario
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      username, email, password, data,
    } = req.body;
    // Hashear el password
    const hash = await bcrypt.hash(password, salt);

    // Guardando el usuario en la base
    /* await Users.create({
      username,
      email,
      password: hash,
      data
    }); */

    const user = new Users(req.body);
    // Asignar el password hasheado antes de guardar en DB
    user.password = hash;

    // Guardar en DB
    await user.save();

    res.send({ status: 'Ok', message: 'User created' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

// Borrar usuario
const deleteUser = async (req:Request, res:Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new Error('missing param userId');
    }
    // Eliminando el usuario
    await Users.findByIdAndDelete(userId);

    // Eliminando los productos vinculados al usuario
    await Products.deleteMany({ user: userId });

    res.send({ status: 'Ok', message: 'User deleted' });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

// Obtener usuarios
const getUsers = async (req:Request, res:Response): Promise<void> => {
  try {
    const users = await Users.find().select({ password: 0, _v: 0, role: 0 });
    res.send({ status: 'Ok', data: users });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

// Actualizar usuario
const updateUser = async (req:Request, res:Response): Promise<void> => {
  try {
    console.log(req.sessionData.userId);
    // Obtener datos del usuario
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      username, email, userId, data,
    } = req.body;
    await Users.findByIdAndUpdate(req.sessionData.userId, {
      username,
      email,
      data,
    });
    res.send({ status: 'Ok', message: 'User update' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res.status(400).send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    console.log(`createProduct error: ${error}`);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

export default {
  createUser, deleteUser, getUsers, updateUser, login,
};

// Importar modelo de Users
const Users = require('../../mongo/models/users');

// Importar modelo de Productos
const Products = require('../../mongo/models/products')

// Importar JWT
const jwt = require('jsonwebtoken');
const expiresIn = 3600;

// Importar bcrypt
const bcrypt = require('bcrypt');

// Pasar rondas del salt
const salt = 15;

// Metodo para login
const login = async (req, res) => {
  try {
   
    const { email, password } = req.body;
    const user = await Users.findOne({ email })
    if (user) {
      // Generando el jwt
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: expiresIn });
      // Comprobar la contraseña
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        res.send({ status: 'Ok', data: [user, token ]});
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
const createUser = async (req, res) => {
  try {
    // Obtener datos del usuario
    const { username, email, password, data } = req.body;
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
const deleteUser = async (req, res) => {
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
const getUsers = async (req, res) => {
  try {
    const users = await Users.find().select({password : 0, _v: 0, role: 0});
    res.send({ status: 'Ok', data: users });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};
 

// Actualizar usuario
const updateUser = async (req, res) => { 
  try {
    console.log(req.sessionData.userId);
    // Obtener datos del usuario
    const { username, email, userId, data } = req.body;
    await Users.findByIdAndUpdate(req.sessionData.userId, {
      username,
      email,
      data
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

module.exports = {
  createUser, deleteUser, getUsers, updateUser,login
};

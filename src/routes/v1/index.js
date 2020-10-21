// Importamos usersRouter y productsRoutes
const productsRoutes = require('./productsRoutes');
const usersRoutes = require('./usersRoutes');

module.exports = app => {
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/products', productsRoutes);
};

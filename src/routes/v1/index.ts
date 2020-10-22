// Importar desde express
import { Application } from 'express';

// Importamos usersRouter y productsRoutes
import productsRoutes from './productsRoutes';
import usersRoutes from './usersRoutes';

export default (app: Application): void => {
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/products', productsRoutes);
};

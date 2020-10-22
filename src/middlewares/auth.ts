/* eslint-disable @typescript-eslint/no-explicit-any */
// Importar modulos de express
import { Request, Response, NextFunction } from 'express';

// Importar JWT
import jwt from 'jsonwebtoken';

// Definir funcion de middleware
const isValidHostname = (req:Request, res:Response, next:NextFunction): void => {
  const validHost = ['localhost', 'hola', 'nada'];
  if (validHost.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({ status: 'ACESS DENIED' });
  }
};
// Definir funcion de middleware
const isAuth = (req:Request, res:Response, next:NextFunction): void => {
  try {
    const { token } = req.headers;
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data: any = jwt.verify(token as string, process.env.JWT_SECRET!);
      console.log(data);
      req.sessionData = { userId: data.userId, role: data.role };
      next();
    } else {
      // Lanzando excepcion personalizada
      // eslint-disable-next-line no-throw-literal
      throw { code: 403, status: 'ACCESS DENIED', message: 'Missing header token' };
    }
  } catch (error) {
    res.status(error.code || 500).send({ status: error.status || 'ERROR', message: error.message });
  }
};

// Definir funcion de middleware
const isAdmin = (req:Request, res:Response, next:NextFunction): void => {
  try {
    const { role } = req.sessionData;
    console.log(role);
    if (role !== 'admin') {
      // eslint-disable-next-line no-throw-literal
      throw { code: 403, status: 'ACCESS DENIED', message: 'Invalid role' };
    } else {
      next();
    }
  } catch (error) {
    res.status(error.code || 500).send({ status: error.status || 'ERROR', message: error.message });
  }
};

// Exportar
export { isValidHostname, isAuth, isAdmin };

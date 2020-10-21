// Importar JWT
const jwt = require('jsonwebtoken');

// Definir funcion de middleware
const isValidHostname = (req, res, next) => {
    const validHost = ['localhost', 'hola', 'nada']
    if (validHost.includes(req.hostname)) {
        next();
    } else {
        res.status(403).send({ status: 'ACESS DENIED' });
    }
}
// Definir funcion de middleware
const isAuth = (req, res, next) => {
    try {
        const { token } = req.headers;
        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            console.log(data);
            // Comprobando que el usuario que va a modificar es el propio usuario
            /* if (data.userId !== req.body.userId && data.role !== 'admin') {
                // Lanzando excepcion personalizada
                throw { code: 403, status: 'ACCESS DENIED', message: 'Missing permision or invalid role' };
            } */
            req.sessionData = { userId: data.userId, role: data.role };
            next();
        } else {
            // Lanzando excepcion personalizada
            throw { code: 403, status: 'ACCESS DENIED', message: 'Missing header token' };
        }
        
    } catch (error) {
        res.status(error.code || 500).send({ status: error.status || 'ERROR', message: error.message });
    }
}

// Definir funcion de middleware
const isAdmin = (req, res, next) => {
    try {
        const { role } = req.sessionData;
        console.log(role)
        if (role !== 'admin') {
             throw { code: 403, status: 'ACCESS DENIED', message: 'Invalid role' };
        } else {
            next();
        }
    } catch (error) {
        res.status(error.code || 500).send({ status: error.status || 'ERROR', message: error.message });
    }
}


// Exportar
module.exports = { isValidHostname, isAuth, isAdmin };
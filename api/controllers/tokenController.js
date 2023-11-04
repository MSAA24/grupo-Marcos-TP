const jwt = require('jsonwebtoken');

const verificarToken = (req) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);
    
    try {
        const verified = jwt.verify(token, jwtSecretKey);
        return verified;
    } catch (error) {
        return false; // Error al verificar el token
    }
};

module.exports = {
    verificarToken
};





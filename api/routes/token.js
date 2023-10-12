var express = require("express");
var router = express.Router();
const dotenv = require('dotenv');
const jwt  = require('jsonwebtoken');

router.post("/generarToken", (req,res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        //time: Date(),
        userId: 12
    }
    const token = jwt.sign(data, jwtSecretKey);
    res.send(token)
});

router.get("/validarToken", (req,res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    try {
        if (verified) {
            return res.send("Verificado");
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }

});

module.exports = router;
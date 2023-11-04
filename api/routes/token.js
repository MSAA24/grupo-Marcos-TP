var express = require("express");
var router = express.Router();
const jwt  = require('jsonwebtoken');
const {verificarToken} = require("../controllers/tokenController");

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
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
            return res.send("Verificado");
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }

});

module.exports = router;
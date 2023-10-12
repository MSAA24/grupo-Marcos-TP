var express = require("express");
var router = express.Router();
var models = require("../models");
const dotenv = require('dotenv');
const jwt  = require('jsonwebtoken');


/*
router.post("/generarToken", (req,res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
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
*/

router.get("/", (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const cantAVer = parseInt(req.query.cantAVer);
    const paginaActual = parseInt(req.query.paginaActual) ;
    
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    try {
        if (verified) {
            models.alumno
                .findAll({
                attributes: ['id', 'nombre', 'apellido'],
                offset:((paginaActual-1)*cantAVer),
                limit : cantAVer
    })
    .then((alumnos) => res.send(alumnos))
    .catch(() => res.sendStatus(500));
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }

    
});

router.post('/', (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
      
    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    console.log(req.body)
    try {
        if (verified) {
            models.alumno
                .create({ nombre: req.body.nombre, apellido: req.body.apellido})
                .then((alumno) => res.status(201).send({ id: alumno.id }))
                .catch((error) => {
                if (error === 'SequelizeUniqueConstraintError: Validation error') {
                    res
                    .status(400)
                    .send('Bad request: existe otro alumno con el mismo nombre');
                } else {
                    console.log(`Error al intentar insertar en la base de datos: ${error}`);
                    res.sendStatus(500);
                }
    });
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }

    
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
        .findOne({
        attributes: ['id', 'nombre', 'apellido'],
        where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    try {
        if (verified) {
            findAlumno(req.params.id, {
                onSuccess: (alumno) => res.send(alumno),
                onNotFound: () => res.sendStatus(404),
                onError: () => res.sendStatus(500),
            });
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }
    
    
});

router.put('/:id', (req, res) => {
    const {nombre, apellido} = req.body;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(apellido) update.apellido = apellido ;
    
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    try {
        if (verified) {
            const onSuccess = (alumno) =>
            alumno
            .update(update)
            .then(() => res.sendStatus(200))
            .catch((error) => {
                if (error === 'SequelizeUniqueConstraintError: Validation error') {
                res
                    .status(400)
                    .send('Bad request: existe otra inscipcion con el mismo Alumno y Materia');
                } else {
                console.log(
                    `Error al intentar actualizar la base de datos: ${error}`,
                );
                res.sendStatus(500);
            }
    });
    findAlumno(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }
    
    
});

router.delete('/:id', (req, res) => {
    
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.header(tokenHeaderKey);
    const verified = jwt.verify(token, jwtSecretKey);
    try {
        if (verified) {
            const onSuccess = (alumno) =>
            alumno
            .destroy()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
        findAlumno(req.params.id, {
            onSuccess,
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500),
        });
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }
    
    
});

module.exports = router;
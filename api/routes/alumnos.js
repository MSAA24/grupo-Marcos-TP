var express = require("express");
var router = express.Router();
var models = require("../models");
const dotenv = require('dotenv');
const jwt  = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     Alumno:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado del alumno
 *         nombre:
 *           type: string
 *           description: El nombre del alumno
 *         apellido:
 *           type: string
 *           description: El apellido del alumno
 *       example:
 *         id: 1000
 *         nombre: Juan
 *         apellido: Perez
 */

/**
  * @swagger
  * tags:
  *   name: Alumnos
  *   description: Manejo Alumnos API
  */

/**
 * @swagger
 * /alu:
 *   get:
 *     tags: [Alumnos]
 *     summary: Retorna la lista de todos los alumnos
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true       
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *                  
 */

/**
 * @swagger
 * /alu:
 *   post:
 *     tags: [Alumnos]
 *     summary: Retorna la lista de todos los alumnos
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true       
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *                  
 */
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

router.get("/", (req, res) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    const cantAVer = parseInt(req.query.cantAVer) || 10;
    const paginaActual = parseInt(req.query.paginaActual) || 1;
    
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
    const {id_alumno, id_materia} = req.body;
    const update = {} ;
    if(id_alumno) update.id_alumno = id_alumno ;
    if(id_materia) update.id_materia = id_materia ;
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
});

router.delete('/:id', (req, res) => {
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
});

module.exports = router;
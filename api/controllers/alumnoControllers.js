const {verificarToken} = require("../controllers/tokenController");
const express = require('express');
var models = require("../models");

const getAlumnos = (req,res) => {
    const cantAVer = parseInt(req.query.cantAVer);
    const paginaActual = parseInt(req.query.paginaActual) ;

    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
};

const postAlumnos = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
}

const getAlumno = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
}

const putAlumno = (req,res) => {
    const {nombre, apellido} = req.body;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(apellido) update.apellido = apellido ;
    
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
    
}

const deleteAlumno = (req,res) =>{
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
}

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
        .findOne({
        attributes: ['id', 'nombre', 'apellido'],
        where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};



module.exports = {
    getAlumnos,
    postAlumnos,
    getAlumno,
    putAlumno,
    deleteAlumno
};
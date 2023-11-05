const {verificarToken} = require("../controllers/tokenController");
var models = require("../models");

const getInscripciones = (req,res) => {
    const cantAVer = parseInt(req.query.cantAVer) || 10;
    const paginaActual = parseInt(req.query.paginaActual) || 1;
    
    try {
      const tokenValido = verificarToken(req);
      if(tokenValido) {
  
        models.inscripcion.findAll({attributes: ["id","id_materia","id_alumno"],
            
            /////////se agrega la asociacion 
            include:[{as:'Inscripcion-Alumno-Relacion', model:models.alumno, attributes: ["id","nombre", "apellido"]},
              {as:'Inscripcion-Materia-Relacion', model:models.materia, attributes: ["id","nombre"]}], 
            ////////////////////////////////
            
            offset:((paginaActual-1)*cantAVer),
            limit : cantAVer
          })
          .then(inscripciones => res.send(inscripciones)).catch(error => { return next(error)});
          }else {
            return res.status(401).send(error);
        }
  } catch (error){
      return res.status(401).send(error);
  }
};

const postInscripcion= (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if(tokenValido){
          models.inscripcion
            .create({ id_alumno: req.body.id_alumno, id_materia: req.body.id_materia })
              .then(inscripcion => res.status(201).send({ id: inscripcion.id }))
              .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                  res.status(400).send('Bad request: ya existe una inscripcion del alumno a la materia')
                }
                else {
                  console.log(`Error al intentar insertar en la base de datos: ${error}`)
                  res.sendStatus(500)
                }
              });
        }
    }catch (error){
        return res.status(401).send(error);
    }
}

const findInscripcion = (id, { onSuccess, onNotFound, onError }) => {
    models.inscripcion
      .findOne({
        attributes: ["id", "id_materia", "id_alumno"],
        include:[{as:'Inscripcion-Alumno-Relacion', model:models.alumno, attributes: ["id","nombre", "apellido"]},
              {as:'Inscripcion-Materia-Relacion', model:models.materia, attributes: ["id","nombre"]}], 
        where: { id }
      })
      .then(inscripcion => (inscripcion ? onSuccess(inscripcion) : onNotFound()))
      .catch(() => onError());
  };

const getInscripcion = (req,res) => {
    try{
        const tokenValido = verificarToken(req);
        if(tokenValido){
          findInscripcion(req.params.id, {
            onSuccess: inscripcion => res.send(inscripcion),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
          });
        }
    }catch (error){
    return res.status(401).send(error);
    }
}

const putInscripcion = (req,res) => {
    try{
        const tokenValido = verificarToken(req);
        if(tokenValido){
          const {id_alumno, id_materia} = req.body;
          const update = {} ;
          if(id_alumno) update.id_alumno = id_alumno ;
          if(id_materia) update.id_materia = id_materia ;
          const onSuccess = inscripcion =>
          inscripcion
          .update(update)
            .then(() => res.sendStatus(200))
            .catch(error => {
              if (error == "SequelizeUniqueConstraintError: Validation error") {
                res.status(400).send('Bad request: existe otra inscipcion con el mismo Alumno y Materia');
              }
              else {
                console.log(`Error al intentar actualizar la base de datos: ${error}`)
                res.sendStatus(500)
              }
            });
          findInscripcion(req.params.id, {
          onSuccess,
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
          });
        }else {
          return res.status(401).send(error);
        }
    }catch (error){
    return res.status(401).send(error);
    }
}

const deleteInscripcion = (req,res) =>{
    try{
        const tokenValido = verificarToken(req);
        if(tokenValido){
          const onSuccess = inscripcion =>
            inscripcion
              .destroy()
              .then(() => res.sendStatus(200))
              .catch(() => res.sendStatus(500));
          findInscripcion(req.params.id, {
            onSuccess,
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
          });
        }else {
          return res.status(401).send(error);
        } 
    }catch (error){
        return res.status(401).send(error);
    }
}


module.exports = {
    getInscripciones,
    postInscripcion,
    getInscripcion,
    putInscripcion,
    deleteInscripcion
};
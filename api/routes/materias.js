var express = require("express");
var router = express.Router();
var models = require("../models");


const {verificarToken} = require("../controllers/tokenController");

router.get("/", (req, res,next) => {
  const cantAVer = parseInt(req.query.cantAVer) || 10;
  const paginaActual = parseInt(req.query.paginaActual) || 1;

    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
          models.materia.findAll({attributes: ["id","nombre","id_carrera"],
      
          /////////se agrega la asociacion 
          include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
          ////////////////////////////////
          offset:((paginaActual-1)*cantAVer),
          limit : cantAVer
          }).then(materias => res.send(materias)).catch(error => { return next(error)});
        }else {
            return res.status(401).send(error);
        }
    } catch (error){
        return res.status(401).send(error);
    }
  
});



router.post("/", (req, res) => {
    try {
      const tokenValido = verificarToken(req);
      if (tokenValido) {
        models.materia
        .create({ nombre: req.body.nombre,id_carrera:req.body.id_carrera })
        .then(materia => res.status(201).send({ id: materia.id }))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otra materia con el mismo nombre')
          }
          else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
      }else {
          return res.status(401).send(error);
      }
    } catch (error){
        return res.status(401).send(error);
    }
  
  
});

const findmateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {

    try {
      const tokenValido = verificarToken(req);
      if (tokenValido) {
        findmateria(req.params.id, {
          onSuccess: materia => res.send(materia),
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
        });
      }else {
          return res.status(401).send(error);
      }
    } catch (error){
        return res.status(401).send(error);
    }
  
  
});

router.put("/:id", (req, res) => {
  try {
      const tokenValido = verificarToken(req);
      if (tokenValido) {
        const onSuccess = materia =>
        materia
          .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
          .then(() => res.sendStatus(200))
          .catch(error => {
            if (error == "SequelizeUniqueConstraintError: Validation error") {
              res.status(400).send('Bad request: existe otra materia con el mismo nombre')
            }
            else {
              console.log(`Error al intentar actualizar la base de datos: ${error}`)
              res.sendStatus(500)
            }
          });
        findmateria(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
      });
    }else {
        return res.status(401).send(error);
    }
    } catch (error){
        return res.status(401).send(error);
    }
  
  
  
});

router.delete("/:id", (req, res) => {
    try {
      const tokenValido = verificarToken(req);
      if (tokenValido) {
        const onSuccess = materia =>
        materia
          .destroy()
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(500));
        findmateria(req.params.id, {
          onSuccess,
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
        });
      }else {
          return res.status(401).send(error);
      }
    } catch (error){
        return res.status(401).send(error);
    }
  
  
});

module.exports = router;

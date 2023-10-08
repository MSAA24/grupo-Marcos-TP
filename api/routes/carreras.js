var express = require("express");
var router = express.Router();
var models = require("../models");

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
  const cantAVer = parseInt(req.query.cantAVer) || 10;
  const paginaActual = parseInt(req.query.paginaActual) || 1;
    models.carrera
      .findAll({
        attributes: ['id', 'nombre'],
        offset:((paginaActual-1)*cantAVer),
        limit : cantAVer
      })
      .then((carreras) => res.send(carreras))
      .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;

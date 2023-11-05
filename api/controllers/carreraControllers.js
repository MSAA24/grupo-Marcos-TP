const {verificarToken} = require("../controllers/tokenController");
var models = require("../models");

const getCarreras = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
        }else {
            return res.status(401).send(error);
        }
      } catch (error){
          return res.status(401).send(error);
      }    
}

const postCarrera = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
        }else {
            return res.status(401).send(error);
        }
      } catch (error){
          return res.status(401).send(error);
      }
    
}
const getCarrera = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
          findCarrera(req.params.id, {
            onSuccess: carrera => res.send(carrera),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
          });
        }else {
            return res.status(401).send(error);
        }
      } catch (error){
          return res.status(401).send(error);
      }
}

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
    models.carrera
      .findOne({
        attributes: ["id", "nombre"],
        where: { id }
      })
      .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
      .catch(() => onError());
};

const putCarrera = (req,res) =>{
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
        }else {
            return res.status(401).send(error);
        }
      } catch (error){
          return res.status(401).send(error);
      }
}

const deleteCarrera = (req,res) => {
    try {
        const tokenValido = verificarToken(req);
        if (tokenValido) {
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
        }else {
            return res.status(401).send(error);
        }
      } catch (error){
          return res.status(401).send(error);
      }
}

module.exports = {
    getCarreras,
    postCarrera,
    getCarrera,
    putCarrera,
    deleteCarrera
};
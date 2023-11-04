var express = require("express");
var router = express.Router();
const {getAlumnos, postAlumnos, getAlumno, putAlumno, deleteAlumno} = require("../controllers/alumnoControllers");

router.get("/", getAlumnos)

router.post('/', postAlumnos)

router.get('/:id', getAlumno)

router.put('/:id', putAlumno)

router.delete('/:id', deleteAlumno)

module.exports = router;
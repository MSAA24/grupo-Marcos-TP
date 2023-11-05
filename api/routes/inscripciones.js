var express = require("express");
var router = express.Router();
const {getInscripcion, putInscripcion, deleteInscripcion, postInscripcion, getInscripciones } = require("../controllers/inscripcionesControllers");

router.get("/", getInscripciones)

router.post("/", postInscripcion)
  
router.get("/:id", getInscripcion)

router.put("/:id", putInscripcion)

router.delete("/:id", deleteInscripcion)

module.exports = router;
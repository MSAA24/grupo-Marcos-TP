var express = require("express");
var router = express.Router();
const {getMaterias, postMateria, getMateria, putMateria, deleteMateria} = require("../controllers/materiaControllers");

router.get("/", getMaterias )

router.post("/", postMateria)

router.get("/:id", getMateria)

router.put("/:id", putMateria)

router.delete("/:id", deleteMateria)

module.exports = router;

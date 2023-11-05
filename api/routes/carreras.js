var express = require("express");
var router = express.Router();
const {getCarreras, postCarrera, getCarrera, putCarrera, deleteCarrera} = require("../controllers/carreraControllers");

router.get("/", getCarreras)

router.post("/", postCarrera) 
    
router.get("/:id", getCarrera)

router.put("/:id", putCarrera)

router.delete("/:id", deleteCarrera)

module.exports = router;

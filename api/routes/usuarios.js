var express = require('express');
var router = express.Router();
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const usuario = require('../models/usuario');

const User = Models.usuario;
dotenv.config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/crear', async(req, res, next)=>{
  const salt = await bcrypt.genSalt(10);
  var usr = {
    mail : req.body.mail,
    pass : await bcrypt.hash(req.body.pass, salt),
    id_alumno : req.body.id_alumno
  };
  created_user = await User.create(usr);
  res.status(201).json(created_user);
});


router.post('/',async(req,res,next)=>{
    const user = await User.findOne({ where : {mail : req.body.mail }});
    if(user){
       const password_valid = await bcrypt.compare(req.body.pass,user.pass);
       if(password_valid){
           token = jwt.sign({ "id" : user.id,"mail" : user.mail },process.env.JWT_SECRET_KEY);
           res.status(200).json({ token : token });
       } else {
         res.status(400).json({ error : "contraseña incorrecta" });
       }
     
     }else{
       res.status(404).json({ error : "usuario inexistente" });
     }
     
     });

module.exports = router;

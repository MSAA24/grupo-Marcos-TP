var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const fs = require('fs');
//logger
var logger = require('morgan');

//routes
var carrerasRouter = require('./routes/carreras');
var alumnosRouter = require('./routes/alumnos');
var materiasRouter = require('./routes/materias');
var inscripcionesRouter = require('./routes/inscripciones');
var tokenRouter = require('./routes/token');
var usuarioRouter = require('./routes/usuarios');

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require('dotenv');
const yaml = require('yamljs');

//jwt
const jwt  = require('jsonwebtoken');

var app = express();

dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//morgan
/*
app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
})) */


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocument = yaml.load('./swagger.yaml');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'info.log'),{flags: 'a'})
const errorAccessLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'),{flags: 'a'})


logger.token('type', function (req, res){
  return req.headers['content-type']
})

app.use(logger(':method :url :status :res[content-length] - :response-time ms :date[web] :type', {skip: function (req, res) { return res.statusCode > 400 }, stream:accessLogStream}));
app.use(logger(':method :url :status :res[content-length] - :response-time ms :date[web] :type' , {skip: function (req, res) { return res.statusCode < 400 }, stream:errorAccessLogStream}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/login', usuarioRouter);
app.use('/car', carrerasRouter);
app.use('/alu', alumnosRouter);
app.use('/mat', materiasRouter);
app.use('/ins', inscripcionesRouter);
app.use('/token', tokenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

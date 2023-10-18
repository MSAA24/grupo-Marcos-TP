'use strict';
module.exports = (sequelize, DataTypes) => {
  const usuario = sequelize.define('usuario', {
    mail: DataTypes.STRING,
    pass: DataTypes.STRING,
    id_alumno: DataTypes.INTEGER
  }, {});
  usuario.associate = function(models) {
    usuario.belongsTo(models.alumno,  
      {
          as: 'usuario-Alumno',          
          foreignKey: 'id_alumno'       
      })
      
  };
  return usuario;
};
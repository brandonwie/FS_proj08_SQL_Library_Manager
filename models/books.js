'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    year: DataTypes.NUMBER
  }, {});
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};
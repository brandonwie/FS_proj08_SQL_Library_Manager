"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"TITLE" is required',
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"AUTHOR" is required',
          },
        },
      },
      genre: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
      },
    },
    { sequelize }
  );
  return Book;
};

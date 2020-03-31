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
        validate: {
          notEmpty: {
            msg: '"GENRE" is required',
          },
        },
      },
      year: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: '"YEAR" is required',
          },
        },
      },
    },
    { sequelize }
  );
  return Book;
};

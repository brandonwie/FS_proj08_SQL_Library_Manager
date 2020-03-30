"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Title" is required',
          },
        },
      },
      author: Sequelize.STRING,
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER,
    },
    { sequelize }
  );
  return Book;
};

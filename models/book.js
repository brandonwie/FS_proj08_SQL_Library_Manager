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
            msg: '"Title" is required.',
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Author" is required.',
          },
        },
      },
      genre: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
        // validate: {
        //   is: {
        //     args: /[1-2]\d{3}/,
        //     msg: "Type a valid year.",
        //   },
        // },
      },
    },
    { sequelize }
  );
  return Book;
};

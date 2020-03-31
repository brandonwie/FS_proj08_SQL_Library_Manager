const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* GET books listing. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.render("books/index", {
      books,
      title: "Books",
    });
  })
);

/* Create a new book form. */
router.get("/new", (req, res) => {
  res.render("books/new-book", {
    book: {},
    title: "New Book",
  });
});

/* POST a new book. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError"
      ) {
        book = await Book.build(req.body);
        res.render("books/new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

/* Get individual book & Edit book form. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(
      req.params.id
    );
    if (book) {
      res.render("books/update-book", {
        book,
        title: "Update Book",
      });
    } else {
      res.render("books/page-not-found");
    }
  })
);

/* Update an book. */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError"
      ) {
        book = await Book.build(req.body);
        article.id = req.params.id; // make sure correct book gets updated
        res.render("books/edit", {
          book,
          errors: error.errors,
          title: "Update Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete individual book. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(
      req.params.id
    );
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;

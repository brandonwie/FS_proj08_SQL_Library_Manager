const express = require("express");
const router = express.Router();
const { Books } = require("../models/books");

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
    const books = await Books.findAll({
      order: [["createAt", "DESC"]],
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

/* POST create book. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError"
      ) {
        book = await Book.build(req.body);
        res.render("books/new", {
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
      res.render("books/update", {
        book,
        title: "Update Book",
      });
    } else {
      res.sendStatus(404);
    }
  })
);

/* Update an book. */
router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books" + books.id);
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

const express = require("express");
const router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");

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
		const page = req.query.page;
		const query = req.query.term;
		const limit = 5;
		const offset = (page - 1) * limit;

		if (!query) {
			const books = await Book.findAndCountAll({
				order: [ [ "title", "ASC" ] ],
				limit,
				offset
			});
			const totalPages = Math.ceil(books.count / limit);
			res.render("books/index", {
				books,
				totalPages,
				page,
				title: "Library Database"
			});
		} else {
			const books = await Book.findAndCountAll({
				order: [ [ "title", "ASC" ] ],
				limit,
				offset,
				where: {
					[Op.or]: {
						title: {
							[Op.like]: `%${query}%`
						},
						author: {
							[Op.like]: `%${query}%`
						},
						genre: {
							[Op.like]: `%${query}%`
						},
						year: {
							[Op.like]: `%${query}%`
						}
					}
				}
			});
			const totalPages = Math.ceil(books.count / limit);
			res.render("books/index", {
				books,
				totalPages,
				query,
				page,
				title: `Result(s) of ${query}`
			});
		}
	})
);

/* Search books */
router.post(
	"/",
	asyncHandler(async (req, res) => {
		let term = req.body.term.toLowerCase();
		const page = 1;
		const limit = 5;
		const offset = (page - 1) * limit;
		const books = await Book.findAndCountAll({
			order: [ [ "title", "ASC" ] ],
			limit,
			offset,
			where: {
				[Op.or]: {
					title: {
						[Op.like]: `%${term}%`
					},
					author: {
						[Op.like]: `%${term}%`
					},
					genre: {
						[Op.like]: `%${term}%`
					},
					year: {
						[Op.like]: `%${term}%`
					}
				}
			}
		});
		const query = req.body.term;

		const totalPages = Math.ceil(books.count / limit);
		// if no book is found, render an error page
		if (books.count > 0) {
			res.render("books/index", {
				books,
				totalPages,
				query,
				page,
				title: `Result(s) of ${query}`
			});
		} else {
			res.render("books/book-not-found", {
				query
			});
		}
	})
);

/* Create a new book form. */
router.get("/new", (req, res) => {
	res.render("books/new-book", {
		book: {},
		title: "New Book"
	});
});

/* POST a new book. */
router.post(
	"/new",
	asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.create(req.body);
			res.redirect("/");
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				book = await Book.build(req.body);
				res.render("books/new-book", {
					book,
					errors: error.errors,
					title: "New Book"
				});
			} else {
				throw error;
			}
		}
	})
);

/* Get individual book & Edit book form. */
router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		try {
			const book = await Book.findByPk(req.params.id);
			res.render("books/update-book", {
				book,
				title: "Update Book"
			});
		} catch (error) {
			throw error;
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
				res.redirect("/");
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			if (error.name === "SequelizeValidationError") {
				book = await Book.build(req.body);
				book.id = req.params.id; // make sure correct book gets updated
				res.render("books/update-book", {
					book,
					errors: error.errors,
					title: "Update Book"
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
		const book = await Book.findByPk(req.params.id);
		if (book) {
			await book.destroy();
			res.redirect("/");
		} else {
			res.sendStatus(404);
		}
	})
);

module.exports = router;

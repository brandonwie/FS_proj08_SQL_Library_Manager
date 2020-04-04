const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "public"))
);

app.use("/", routes);
app.use("/books", books);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error =
    req.app.get("env") === "development"
      ? err
      : {};
  console.log(err.message, err.status);

  /******************************
  Error Handler Middleware
******************************/

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    // if there's no page exist
    res.render("books/page-not-found", {
      title: "Page Not Found",
      heading: "Page Not Found",
      message:
        "Sorry! We couldn't find the page you were looking for.",
    });
  } else {
    // if there's no book ID exist (or other errors caught)
    res.render("books/page-not-found", {
      title: "Page Not Found",
      heading: "Server Not Found",
      message:
        "Sorry! There was an unexpected error on the server.",
    });
  }
});

module.exports = app;

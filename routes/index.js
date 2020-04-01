const express = require("express");
const router = express.Router();
const url = require("url");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect(
    url.format({
      pathname: "/books",
      query: {
        page: 1,
      },
    })
  );
});

module.exports = router;

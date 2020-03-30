let express = require("express");
let http = require("http");
const path = require("path");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// port setup
app.set("port", process.env.PORT || "3000");
app.listen("3000");

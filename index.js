const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config");
require("./startup/validation");

const port = process.env.PORT || 1000;
app.listen(port, () => winston.info(`Connected to port ${port} ...`));

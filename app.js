const express = require("express");
require("dotenv").config();
require("./config/database").connect();
var cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors()); 

global.User = require('./model/user');
const routes = require('./routes/userRoutes');



routes(app);

module.exports = app;

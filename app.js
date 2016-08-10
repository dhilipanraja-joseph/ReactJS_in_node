
require('dotenv').config();
const PORT = process.env.PORT || 8000;

const mysql = require('mysql');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/grades', require('./routes/grades'));

app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});

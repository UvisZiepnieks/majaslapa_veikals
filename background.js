var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var json = require('json');
const express = require('express');
const path = require('path');
const { JSDOM } = require("jsdom");
const myJSDom = new JSDOM("./index.html");
const $ = require('jquery')(myJSDom.window);

var results;
var vards;
var uzvards;
var epasts;
var parole;
var id;
var insert1;
var insert2;
var insert3;
var insert4;
var table;

const bodyParser = require('body-parser');
const app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
const port = 8080;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "website"
});

con.connect(function (err) {
  if (err) throw err;
});

app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server running on port${port}`);
});

// produktu lapa
app.all('/', function (req, res) {

  con.query("SELECT * FROM produkti", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './produkti.html'), { title: 'User List', userData: result });
  });
});





//lietotaju lapa
app.all('/users', function (req, res) {

  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './index.html'), { title: 'User List', userData: result });
  });
});



app.post('/insert', (req, res) => {
  res.send(`Ievietotie dati ir: ${req.body.vards} ${req.body.uzvards} ${req.body.epasts} ${req.body.parole}.`);
  insert1 = req.body.vards;
  insert2 = req.body.uzvards;
  insert3 = req.body.epasts;
  insert4 = req.body.parole;
  callInsert();
});



app.all('/edit', function (req, res) {

  console.log("id " + req.body.id);
  con.query("SELECT * FROM users WHERE id=" + req.body.id, function (err, result, fields) {
    if (err) throw err;
    table = "";
    console.log(result);
    res.render(path.join(__dirname, './edit.html'), { title: 'User List', userData: result });
  });
});

app.all('/update', (req, res) => {
  res.send(`Izmainītie dati ir :${req.body.vards} ${req.body.uzvards} ${req.body.epasts} ${req.body.parole}.`);
  id = req.body.id;
  insert1 = req.body.vards;
  insert2 = req.body.uzvards;
  insert3 = req.body.epasts;
  insert4 = req.body.parole;
  console.log("insert1: " + insert1);
  updateData(id, insert1, insert2, insert3, insert4);
});


app.all('/delete', (req, res) => {
  res.send(`Dzēstie dati ir :${req.body.idd}.`);
  id = req.body.idd;
  deleteData(id);
});


function getData() {
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

function writeData(vards, uzvards, epasts, parole) {
  con.connect(function (err) {
    con.query("INSERT into users (vards, uzvards, epasts, parole) VALUES ('" + vards + "', '" + uzvards + "', '" + epasts + "', '" + parole + "')", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

function updateData(id, vards, uzvards, epasts, parole) {
  con.connect(function (err) {
    con.query('UPDATE users SET vards="' + vards + '", uzvards="' + uzvards + '" , epasts="' + epasts + '", parole="' + parole + '" where id = ' + id, function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " Izmainitas rindas");
    });
  });
}
function deleteData(id) {
  con.connect(function (err) {
    con.query("Delete from users where id = " + id, function (err, result, fields) {
      if (err) throw err;
      console.log(result.affectedRows + " Izmainitas rindas");
    });
  });
}

function showData() {
  app.all('/', function (req, res) {

    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      table = "";
      console.log(result);
      res.render(path.join(__dirname, './index.html'), { title: 'User List', userData: result });
    });
  });
}


function callInsert() {
  writeData(insert1, insert2, insert3, insert4);
}
function callSelect() {
  getData();
}


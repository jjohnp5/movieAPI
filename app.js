/**
 * Created by John on 6/19/2017.
 */

var express = require('express');
var app = express();
var path = require("path");
var request = require('request');

app.set("views", path.join(__dirname, '/views'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get("/", function (req, res) {
   res.render("landing");
});
app.get("/movies", function(req, res){
   res.render("movies");
});
app.get("/movies/popular", function (req, res) {
    request("https://api.themoviedb.org/3/movie/popular?api_key=f2542b8b01898f42918c9addc4ed07a0", function (error, response, body) {
        var result = JSON.parse(body);
        res.render("popular", {results: result.results});
    })
});


app.listen(3000, function () {
    console.log("movie api started");
});
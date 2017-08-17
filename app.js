/**
 * Created by John on 6/19/2017.
 */

var express = require('express');
var app = express();
var path = require("path");
var request = require('request');
var bodyParser = require('body-parser');

app.set("views", path.join(__dirname, '/views'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
   res.render("landing");
});
app.get("/movies", function(req, res){
    request("https://api.themoviedb.org/3/movie/top_rated?api_key=f2542b8b01898f42918c9addc4ed07a0&language=en-US&page=1", function (error, response, body){
        var result = JSON.parse(body);
        res.render("movies", {result: result});
    });

});
app.post("/movies/search", function (req, res) {
    var query = req.body.query;
    var queryArr = query.split(" ");
    var keyword = "";
    for(var i = 0; i < queryArr.length; i++){
        if (i === 0 ){
            keyword = queryArr[i];
        }else{
            var base = "%20" + queryArr[i];
            keyword += base;
        }
    }
    console.log(keyword);
    request("https://api.themoviedb.org/3/search/movie?api_key=f2542b8b01898f42918c9addc4ed07a0&language=en-US&query="+keyword, function(error, response, body){
        var result = JSON.parse(body);
       res.render("search", {result: result})
    });
});

app.get("/movies/popular", function (req, res) {
    request("https://api.themoviedb.org/3/movie/popular?api_key=f2542b8b01898f42918c9addc4ed07a0", function (error, response, body) {
        var result = JSON.parse(body);
        res.render("popular", {results: result.results});
    })
});
app.get("/movies/:id", function (req, res) {
    console.log(req.params.id);
    request("https://api.themoviedb.org/3/movie/"+req.params.id+"?api_key=f2542b8b01898f42918c9addc4ed07a0", function (error, response, movie) {
        var result = JSON.parse(movie);
        request("https://api.themoviedb.org/3/movie/"+req.params.id+"/reviews?api_key=f2542b8b01898f42918c9addc4ed07a0&language=en-US&page=1", function (error, response, revs) {
            var reviews = JSON.parse(revs);
            res.render("movie", {result: result, reviews: reviews});

        });
    });
});

app.listen(process.env.PORT, function () {
    console.log("movie api started");
});

var express = require("express");
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

mongoose.connect("mongo://localhost/unit18Populater", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.article.create(result)
            .then(function(dbarticle) {
                console.log(dbarticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });

        res.send("Scrape is done!");
    });
});

app.get("/", function(req, res) {
    res.render("home");
});






app.listen(3000);
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();
mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/userBD",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {
    res.render("secrets");
});

app.get("/submit", function (req, res) {
    res.render("submit");
});

app.post("/register", async(req,res) => {
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save().then(() => {
        res.render("secrets");
    }).catch((err) => {
        console.log(err);
    })
})

app.post("/login", async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then((foundUser) => {
        if(foundUser){
            if(foundUser.password==password){
                res.render("secrets");    
            }
        }
    })
    .catch((error) => {
        console.log(error);
            res.send(400,"Bad Request");    
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
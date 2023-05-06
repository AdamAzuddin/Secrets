//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.route("/login")
.get((req,res)=>{
  res.render("login")
})
.post(async (req,res)=>{
  const username = req.body.username
  const password = req.body.password

  const findUser = await User.findOne({email: username}).exec()
  if (findUser){
    if (findUser.password === password){
      res.render("secrets")
    } else{
      res.send("Wrong username or password")
    }
  } else{
    res.send("User not found")
  }
})

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newEmail = req.body.username;
    const newPassword = req.body.password;

    console.log(newEmail);

    console.log(newPassword);

    const newUser = User({
      email: newEmail,
      password: newPassword,
    });

    newUser.save().then(function (successful) {
        if (successful) {
          res.render("secrets")
        } else {
          console.log("An error occured");
        }
      });
  });
app.listen(3000, function () {
  console.log("Server started at port 3000");
});

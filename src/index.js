const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

//use ejs as the view engine meaning for rendering the html content for it to be seen on the webpage
app.set("view engine", "ejs");

//static files e.g styles,images etc we use app.use.express to access it for it to be seen
app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("login");
});

app.get("/signup", (req, res) =>{
    res.render("signup");
});




const port = 4000;
app.listen(port, () => {
    console.log(`mosmit server is running at port ${port}`);
})
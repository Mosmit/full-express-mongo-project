const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

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

//register user
app.post("/signup", async (req, res) =>{

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //check if the user already exist in the database
    const existinguser = await collection.findOne({name: data.name});
    if(existinguser) {
        res.send("user already exists. Please choose a different username.");
    }else{
        //hash the password using bcrypt, to conceal the original password of the client, then it will converted back to the original password
        const saltRounds = 10; //Number of salt round for bcrypt which is like the number of sequence of strings/numbers we want
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; //replace the hash password with the original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

    
});

// Login user
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send("user name cannot found")
        }

        //compare the hashpassword from the database with the plaain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("home");
        }else{
            req.send("wrong password")
        }
    }catch{
        res.send("wrong details")
    }
});




const port = 4000;
app.listen(port, () => {
    console.log(`mosmit server is running at port ${port}`);
})
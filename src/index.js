const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const axios = require("axios");
const bodyParser = require("body-parser")

const app = express();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

//use ejs as the view engine meaning for rendering the html content for it to be seen on the webpage
app.set("view engine", "ejs");

//static files e.g styles,images etc we use app.use.express to access it for it to be seen
app.use(express.static("public"));

//to use bodyparser which is for passing data from one page to another
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) =>{
    res.render("login");
});

app.get("/signup", (req, res) =>{
    res.render("signup");
});

//personal news addition
app.get("/news", async (req, res) => {
    //res.render("news")
    try {
        const newsAPI = await axios.get("https://raddy.dev/wp-json/wp/v2/posts/")
        //console.log(newsAPI.data)
        res.render("news", { articles : newsAPI.data});
    } catch (err) {
        if (err.response){
            res.render("news", { articles : null})
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.request){
            res.render("news", { articles : null})
            console.log(err.request)
        } else {
            res.render("news", { articles : null})
            console.error("Error", err.message)
        }
        
    }
}); 

//trying app.use for article
// app.use("/news/article")

//personal news addition for the single card-page for continuation
app.get("/news/:id", async (req, res) => {
    let articleID = req.params.id
    try {
        const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts/${articleID}`)
        //console.log(newsAPI.data)
        res.render("newsSingle", { article : newsAPI.data});
    } catch (err) {
        if (err.response){
            res.render("newsSingle", { article : null})
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.request){
            res.render("newsSingle", { article : null})
            console.log(err.request)
        } else {
            res.render("newsSingle", { article : null})
            console.error("Error", err.message)
        }
        
    }
}); 

//to make the search button functional
app.post('/news', async (req, res) => {
    let search = req.body.search
    try {
        const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts?search=${search}`)
        res.render('newsSearch', { articles: newsAPI.data })
    } catch (err) {
        if (err.response) {
            res.render('newsSearch', { articles: null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if (err.requiest) {
            res.render('newsSearch', { articles: null })
            console.log(err.requiest)
        } else {
            res.render('newsSearch', { articles: null })
            console.error('Error', err.message)
        }
    }
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
        res.send("successfully signed-up redirecting...")

    }

    //come back to this later, need to find a way to redirect this page to the login page after getting the message 'successfully signed-up
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

//testing on connecting home to content
app.get("/login/home", (req, res) =>{
    res.render("content1");
});

app.post("/login/home", (req, res) =>{
    
    res.render("news.ejs");
});


const port = 4000;
app.listen(port, () => {
    console.log(`mosmit server is running at port ${port}`);
})
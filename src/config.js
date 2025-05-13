//to create a database connection
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://Mosmit:<db_password>@mosmit.j1jkfm1.mongodb.net/oluwaseun");

//to check the database connection
connect.then(() => {
    console.log("Mosmit Database connected Successfully");
})
.catch(() => {
    console.log("Mosmit Database not Connected");
})

//create a schema which has somewhat kinda similarities to json
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection part not sure it gon work but let me try
const collection = new mongoose.model("users", userSchema);

module.exports = collection;
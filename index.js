
const express = require('express'); //start the server
const app = express(); //start the server
const mongoose = require("mongoose"); //Mongoose provides a straight-forward, schema-based solution to model your application data.
const TodoTask = require("./models/TodoTask"); //models
let port = process.env.PORT || 8080;

require("dotenv").config(); //connect to the database

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true })); //URLencoded allows data extraction from the form by adding it to the body property of the request

mongoose.set("useFindAndModify", false); //connection to db

//run server only after the connection is made
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");


    app.listen(port, () => console.log("Server is On"));
});


app.set("view engine", "ejs"); //view engine configuration


app.get("/", (req, res) => { 
    TodoTask.find({}, (err, tasks) => { 
        res.render("todo.ejs", { todoTasks: tasks }); 
    });
 });

app.post('/', async (req, res) => {
     const todoTask = new TodoTask(
         { content: req.body.content }); 
         try { 
             await todoTask.save(); 
            res.redirect("/"); 
        } 
        catch (err) { 
            res.redirect("/"); 
        } 
    });


app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });});}).post((req, res) => {const id = req.params.id;TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {if (err) return res.send(500, err);res.redirect("/");});});

app.route("/remove/:id").get((req, res) => {const id = req.params.id;TodoTask.findByIdAndRemove(id, err => {if (err) return res.send(500, err);res.redirect("/");});});

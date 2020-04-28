const express = require("express");
const app = express();

//APP CONFIG
//Set template view engine
app.set("view engine", "ejs");
//Set static file location
app.use(express.static("public"));

//ROUTES
//LANDING PAGE
app.get("/", (req, res) => {
    res.render("landing");
});

//INDEX
app.get("/notes", (req, res) => {
    res.render("index");
});

//NEW
app.get("/notes/new", (req, res) => {
    res.render("new");
});

//CREATE
app.post("/notes", (req, res) => {
    res.send("This will create a new note");
});

//SHOW
app.get("/notes/:id", (req, res) => {
    res.render("show");
});

//EDIT
app.get("/notes/:id/edit", (req, res) => {
    res.render("edit");
});

//UPDATE
app.put("/notes/:id", (req, res) => {
    res.send("This will be an updated note");
});

//DESTROY
app.delete("/notes/:id", (req, res) => {
    res.send("This will be a deleted note");
});

//AUTH ROUTES
//REGISTER
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    res.send("This will be a registered user");
});

//LOGIN
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    res.send("This will be a logged in user");
});

//LOGOUT
app.get("/logout", (req, res) => {
    res.send("This will be a logged out user");
});

//WRONG PAGE
app.get("*", (req, res) => {
    res.send("You have hit the wrong page");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
});
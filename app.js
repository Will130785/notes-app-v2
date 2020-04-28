const express = require("express");
const app = express();

//ROUTES
//LANDING PAGE
app.get("/", (req, res) => {
    res.send("Welcome to the notes app");
});

//INDEX
app.get("/notes", (req, res) => {
    res.send("This will be the notes view page");
});

//NEW
app.get("/notes/new", (req, res) => {
    res.send("This will be the create new note page");
});

//CREATE
app.post("/notes", (req, res) => {
    res.send("This will create a new note");
});

//SHOW
app.get("/notes/:id", (req, res) => {
    res.send("This will be an individual note");
});

//EDIT
app.get("/notes/:id/edit", (req, res) => {
    res.send("This will be the edit page");
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
    res.send("This will be the register page");
});

app.post("/register", (req, res) => {
    res.send("This will be a registered user");
});

//LOGIN
app.get("/login", (req, res) => {
    res.send("This will be the login page");
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
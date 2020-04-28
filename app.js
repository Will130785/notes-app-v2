const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
let Note = require("./models/Note");
const app = express();

//APP CONFIG
//Set template view engine
app.set("view engine", "ejs");
//Set static file location
app.use(express.static("public"));
//Set mongoDB location
mongoose.connect("mongodb://localhost/notes-app", {useNewUrlParser: true, useUnifiedTopology: true});
//Use body parser
app.use(bodyParser.urlencoded({extended: true}));
//Set method overrride
app.use(methodOverride("_method"));

//ROUTES
//LANDING PAGE
app.get("/", (req, res) => {
    res.render("landing");
});

//INDEX
app.get("/notes", (req, res) => {
    //Find notes in DB
    Note.find({}, (err, allNotes) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {notes: allNotes});
        }
    });
});

//NEW
app.get("/notes/new", (req, res) => {
    res.render("new");
});

//CREATE
app.post("/notes", (req, res) => {
    //Get data from form
    let title = req.body.title;
    let content = req.body.content;
    let media = req.body.media;
    //Create new note object
    let newNote = {
        title: title,
        content: content,
        media: media
    };

//Create new database note
Note.create(newNote, (err, newNote) => {
    if(err) {
        console.log(err);
    } else {
        res.redirect("/notes");

    }
});

});

//SHOW
app.get("/notes/:id", (req, res) => {
    //Find note in DB
    Note.findById(req.params.id, (err, foundNote) => {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {note: foundNote});
        }
    });
});

//EDIT
app.get("/notes/:id/edit", (req, res) => {
    //Find note in DB
    Note.findById(req.params.id, (err, foundNote) => {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {note: foundNote});
        }

    });
});

//UPDATE
app.put("/notes/:id", (req, res) => {
    //Get data from form
    let title = req.body.title;
    let content = req.body.content;
    let media = req.body.media;

    //Create updated note object
    let updateNote = {
        title: title,
        content: content,
        media: media
    }

    //Search for note and update DB
    Note.findByIdAndUpdate(req.params.id, updateNote, (err, updatedNote) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect(`/notes/${req.params.id}`);
        }
    });
});

//DESTROY
app.delete("/notes/:id", (req, res) => {
    //Find item in DB and delete
    Note.findByIdAndRemove(req.params.id, (err, note) => {
        if(err) {
            console.log(err);
        } else {
            note.remove();
            res.redirect("/notes");
        }
    });
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
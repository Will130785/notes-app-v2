const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");
let Note = require("./models/Note");
let User = require("./models/User");
const app = express();

//APP CONFIG
//Set template view engine
app.set("view engine", "ejs");
//Set static file location
app.use(express.static("public"));
//Set mongoDB location
// mongoose.connect("mongodb://localhost/notes-app", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://will_constable:GC161113@cluster0-dsket.mongodb.net/notes-app?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
//Use body parser
app.use(bodyParser.urlencoded({extended: true}));
//Set method overrride
app.use(methodOverride("_method"));
//Use flash
app.use(flash());
//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "This is a notes application",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Make current user available to all pages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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
app.get("/notes/new", isLoggedIn, (req, res) => {
    res.render("new");
});

//CREATE
app.post("/notes", isLoggedIn, (req, res) => {
    //Get data from form
    let title = req.body.title;
    let content = req.body.content;
    let media = req.body.media;
    //Create author and capture user data
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    //Create new note object
    let newNote = {
        title: title,
        content: content,
        media: media,
        author: author
    };

//Create new database note
Note.create(newNote, (err, newNote) => {
    if(err) {
        req.flash("error", "Your note could not be added");
    } else {
        req.flash("success", "New note added");
        res.redirect("/notes");

    }
});

});

//SHOW
app.get("/notes/:id", (req, res) => {
    //Find note in DB
    Note.findById(req.params.id, (err, foundNote) => {
        if(err || !foundNote) {
            req.flash("error", "Destination not found");
        } else {
            res.render("show", {note: foundNote});
        }
    });
});

//EDIT
app.get("/notes/:id/edit", checkNoteOwnership, (req, res) => {
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
app.put("/notes/:id", checkNoteOwnership, (req, res) => {
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
            req.flash("error", "Could not update note");
        } else {
            req.flash("success", "Note updated");
            res.redirect(`/notes/${req.params.id}`);
        }
    });
});

//DESTROY
app.delete("/notes/:id", checkNoteOwnership, (req, res) => {
    //Find item in DB and delete
    Note.findByIdAndRemove(req.params.id, (err, note) => {
        if(err) {
            req.flash("error", "Could not delete note");
        } else {
            note.remove();
            req.flash("success", "Note deleted");
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
    //Create new user
    let newUser = new User({username: req.body.username});
    //Register new user
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            //Authenticate user with passport-local
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "You have been successfully registered");
                res.redirect("/notes");
            });
        }
    })
});

//LOGIN
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/notes",
    failureRedirect: "/login"
}), (req, res) => {
    req.flash("success", "You have been successfully logged in");
});

//LOGOUT
app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have been successfully logged out");
    res.redirect("/notes");
});

//WRONG PAGE
app.get("*", (req, res) => {
    res.send("You have hit the wrong page");
});

//Middleware
//Check user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be signed in");
    res.redirect("/login");
};

//Check ownership of note
function checkNoteOwnership(req, res, next) {
    //Check if user is loggied in
    if(req.isAuthenticated()) {
        //If yes, find note
        Note.findById(req.params.id, function(err, foundNote) {
            if(err || !foundNote) {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            } else {
                if(foundNote.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started");
});
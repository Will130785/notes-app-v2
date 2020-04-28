const mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    media: String
});

module.exports = mongoose.model("Note", noteSchema);
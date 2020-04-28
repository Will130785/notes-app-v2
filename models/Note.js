const mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    media: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        username: String
    }
});

module.exports = mongoose.model("Note", noteSchema);
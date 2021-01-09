// Paragraph model-----------------------
var mongoose = require("mongoose");

var paraSchema = new mongoose.Schema({
    id: String,
  password: String,
});

module.exports = mongoose.model("user", paraSchema);

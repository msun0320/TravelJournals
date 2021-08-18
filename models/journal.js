const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  title: String,
  image: String,
  location: String,
  date: Date,
  text: String,
  public: Boolean,
});

module.exports = mongoose.model("Journal", JournalSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  title: String,
  location: String,
  date: Date,
  text: String,
  private: Boolean,
});

module.exports = mongoose.model("Journal", JournalSchema);

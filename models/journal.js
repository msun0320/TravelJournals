const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  title: String,
  image: String,
  location: String,
  date: Date,
  text: String,
  public: Boolean,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Journal", JournalSchema);

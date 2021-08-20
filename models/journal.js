const mongoose = require("mongoose");
const Comment = require("./comment");
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  title: String,
  image: String,
  location: String,
  date: Date,
  text: String,
  public: Boolean,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

JournalSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: { $in: doc.comments },
    });
  }
});

module.exports = mongoose.model("Journal", JournalSchema);

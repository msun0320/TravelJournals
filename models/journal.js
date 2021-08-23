const mongoose = require("mongoose");
const Comment = require("./comment");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const JournalSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enums: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

JournalSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/journals/${this._id}">${this.title}</a></strong>
  <p>${this.location}</p>`;
});

JournalSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: { $in: doc.comments },
    });
  }
});

module.exports = mongoose.model("Journal", JournalSchema);

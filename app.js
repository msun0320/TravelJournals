const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { journalSchema, commentSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Journal = require("./models/journal");
const Comment = require("./models/comment");

const journals = require("./routes/journals");

mongoose.connect("mongodb://localhost:27017/travel-journal", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateJournal = (req, res, next) => {
  const { error } = journalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/journals", journals);

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/journals/:id/comments",
  validateComment,
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    journal.comments.push(comment);
    await comment.save();
    await journal.save();
    res.redirect(`/journals/${journal._id}`);
  })
);

app.delete(
  "/journals/:id/comments/:commentId",
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Journal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/journals/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

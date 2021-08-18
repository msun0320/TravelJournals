const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Journal = require("./models/journal");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/journals",
  catchAsync(async (req, res) => {
    const journals = await Journal.find({});
    res.render("journals/index", { journals });
  })
);

app.get("/journals/new", (req, res) => {
  res.render("journals/new");
});

app.post(
  "/journals",
  catchAsync(async (req, res, next) => {
    // if (!req.body.journal) throw new ExpressError("Invalid journal data", 400);
    const journalSchema = Joi.object({
      journal: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        date: Joi.date().required(),
        text: Joi.string().required(),
        public: Joi.boolean(),
      }).required(),
    });
    const { error } = journalSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    console.log(error);
    const journal = new Journal(req.body.journal);
    await journal.save();
    res.redirect(`/journals/${journal._id}`);
  })
);

app.get(
  "/journals/:id",
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    res.render("journals/show", { journal });
  })
);

app.get(
  "/journals/:id/edit",
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    res.render("journals/edit", { journal });
  })
);

app.put(
  "/journals/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const journal = await Journal.findByIdAndUpdate(id, {
      ...req.body.journal,
    });
    res.redirect(`/journals/${journal._id}`);
  })
);

app.delete(
  "/journals/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Journal.findByIdAndDelete(id);
    res.redirect("/journals");
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

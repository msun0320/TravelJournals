const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/journals", async (req, res) => {
  const journals = await Journal.find({});
  res.render("journals/index", { journals });
});

app.get("/journals/:id", async (req, res) => {
  const journal = await Journal.findById(req.params.id);
  res.render("journals/show", { journal });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

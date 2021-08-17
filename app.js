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

app.get("/writejournal", async (req, res) => {
  const journal = new Journal({ title: "First Journal", text: "Had fun!" });
  await journal.save();
  res.send(journal);
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

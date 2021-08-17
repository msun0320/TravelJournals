const mongoose = require("mongoose");
const Journal = require("../models/journal");

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

const seedDB = async () => {
  await Journal.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const journal = new Journal({ title: `sample journal ${i}` });
    await journal.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

const mongoose = require("mongoose");
const cities = require("./cities");
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
    const random1000 = Math.floor(Math.random() * 1000);
    const journal = new Journal({
      author: "611f071e7031d083d82d9507",
      title: "Aenean tempor",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      date: "2018-12-09",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed dictum justo. Cras facilisis diam sed justo condimentum dignissim. Vivamus ac ligula tempor, varius eros at, placerat lectus. Mauris blandit aliquam tincidunt. Ut scelerisque dignissim magna eu congue. Donec velit dui, faucibus et ipsum eget, ornare venenatis ligula. Etiam tincidunt ultrices mauris in varius. Quisque fermentum laoreet leo interdum tincidunt. Duis dictum lacus eget turpis condimentum dictum. Ut luctus facilisis metus, a scelerisque ipsum mollis et. Fusce tincidunt sollicitudin dignissim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer elementum metus sed rutrum vulputate.",
      public: true,
      images: [
        {
          url:
            "https://res.cloudinary.com/dxcl5mpau/image/upload/v1629462463/TravelJournals/k0lmajp57h0weihfqxkk.jpg",
          filename: "TravelJournals/k0lmajp57h0weihfqxkk",
        },
        {
          url:
            "https://res.cloudinary.com/dxcl5mpau/image/upload/v1629462463/TravelJournals/uv7xn08rklklxotswxcn.jpg",
          filename: "TravelJournals/uv7xn08rklklxotswxcn",
        },
      ],
    });
    await journal.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

const Journal = require("../models/journal");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const journals = await Journal.find({});
  res.render("journals/index", { journals });
};

module.exports.renderNewForm = (req, res) => {
  res.render("journals/new");
};

module.exports.createJournal = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.journal.location,
      limit: 1,
    })
    .send();
  console.log(geoData.body.features[0].geometry.coordinates);
  res.send("ok");
  // const journal = new Journal(req.body.journal);
  // journal.images = req.files.map((f) => ({
  //   url: f.path,
  //   filename: f.filename,
  // }));
  // journal.author = req.user._id;
  // await journal.save();
  // req.flash("success", "Successfully added a new journal");
  // res.redirect(`/journals/${journal._id}`);
};

module.exports.showJournal = async (req, res) => {
  const journal = await await Journal.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!journal) {
    req.flash("error", "Cannot find that journal");
    return res.redirect("/journals");
  }
  res.render("journals/show", { journal });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal) {
    req.flash("error", "Cannot find that journal");
    return res.redirect("/journals");
  }
  res.render("journals/edit", { journal });
};

module.exports.updateJournal = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findByIdAndUpdate(id, {
    ...req.body.journal,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  journal.images.push(...imgs);
  await journal.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await journal.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated journal");
  res.redirect(`/journals/${journal._id}`);
};

module.exports.deleteJournal = async (req, res) => {
  const { id } = req.params;
  await Journal.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted journal");
  res.redirect("/journals");
};

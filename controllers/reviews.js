const Listing = require("../models/listing");
const Review = require("../models/reviews.js");

module.exports.createReviews = async (req, res) => {
  console.log(req.params.id);
  let listings = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listings.reviews.push(newReview);
  await listings.save();
  await newReview.save();

  console.log("Reviews Saved");
  //  res.send("Reviews Saved")
  req.flash("success", "New Review Added!");
  res.redirect(`/listings/${listings._id}`);
};

module.exports.destoryReviews = async (req, res) => {
    let { id, reviewsid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsid } });
    await Review.findByIdAndDelete(reviewsid);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }

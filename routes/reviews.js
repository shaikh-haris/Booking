const express = require("express");
const routes = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/warp");

const { findById } = require("../models/reviews.js");

const {
  validateReview,
  isLoggedIn,
  isAuthorReview,
} = require("../middelware.js");
const { createReviews, destoryReviews } = require("../controllers/reviews.js");

routes.post("/", isLoggedIn, validateReview, wrapAsync(createReviews));

//Delete Review Post

routes.delete(
  "/:reviewsid",
  isLoggedIn,
  isAuthorReview,
  wrapAsync(destoryReviews)
);

module.exports = routes;

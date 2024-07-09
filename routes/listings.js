const express = require("express");
const routes = express.Router();
const wrapAsync = require("../utils/warp.js");
const { isLoggedIn, isOwner, Validatelisting } = require("../middelware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const {storage } = require("../cloudConfig.js");
const upload = multer({ storage });

routes
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    // isOwner,
    upload.single("listing[image]"),
    Validatelisting,
   
    wrapAsync(listingControllers.createListing)
  );


// New Route
routes.get("/new", isLoggedIn, listingControllers.renderNewForm);

routes
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    Validatelisting,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// Edit Route
routes.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

module.exports = routes;

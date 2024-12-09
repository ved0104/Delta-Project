const Listing = require("../models/listing")
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILERSDK_CONFIG_APIKEY;

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested, doesn't exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {

    const results = await maptilerClient.geocoding.forward(req.body.listing.location, {
        limit: 1,
    });
    let url = req.file.path
    let filename = req.file.filename
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing")
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    newListing.geometry=results.features[0].geometry;
    let savedListing=await newListing.save()
    console.log(savedListing);
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you requested, doesn't exist")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file !== "undefined") {

        let url = req.file.path
        let filename = req.file.filename

        listing.image = { url, filename }
        await listing.save()
    }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings");
}
const express  = require("express");
const router = express.Router();

// import handlers
const {contact} = require("../controllers/contact");

//router
router.post("/contact", contact);

module.exports = router;
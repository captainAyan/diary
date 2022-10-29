const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/note", require("./noteRoutes"));

module.exports = router;

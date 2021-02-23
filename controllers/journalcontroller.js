let Express = require("express");
let router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

router.get("/practice", validateJWT, (req, res) => {
    res.send("Hey!! This is a practice route!")
});

router.get("/about", (req, res) => {
    res.send("This is the about route!")
});

module.exports = router;
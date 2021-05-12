var express = require("express");
const {check}=require("express-validator");
var router = express.Router();
const { casaPost, casaGet, casaPut,casaDelete } = require("../controllers/casaController");

/* Route users listing. */
router.get("/",casaGet);
router.post("/", casaPost);
router.put("/:id", casaPut);
router.delete("/:id", casaDelete);

module.exports = router;
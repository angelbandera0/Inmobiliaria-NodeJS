var express = require("express");
const {check}=require("express-validator");
var router = express.Router();
const { plantaPost, plantaGet, plantaPut,plantaDelete } = require("../controllers/plantaController");

/* Route users listing. */
router.get("/",plantaGet);
router.post("/", plantaPost);
router.put("/:id", plantaPut);
router.delete("/:id", plantaDelete);

module.exports = router;
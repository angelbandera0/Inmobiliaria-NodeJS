const { Router } = require("express");
const { cantPendientes } = require("../controllers/estadisticasController");

const router = Router();


router.get('/cantPendientes', cantPendientes)

module.exports = router;

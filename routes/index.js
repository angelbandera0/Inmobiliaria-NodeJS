var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop', { title: 'Listado de Plantas | Green World Cuba' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar Sesión | Green World Cuba' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Crear Cuenta | Green World Cuba' });
});
router.get('/user_profile', function(req, res, next) {
  res.render('userProfile', { title: 'Datos del Perfil | Green World Cuba' });
});

module.exports = router;

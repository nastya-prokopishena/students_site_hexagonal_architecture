const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

function setupAuthRoutes(authService) {
  const authController = new AuthController(authService);

  router.post('/login', authController.login.bind(authController));
  router.get('/verify', authController.verify.bind(authController));

  return router;
}

module.exports = setupAuthRoutes;
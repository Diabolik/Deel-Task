const express = require('express');
const { getBestProfession, getBestClients } = require('../controller/admin.controller');
const contractRouter = express.Router();

contractRouter.get('/best-profession', getBestProfession);
contractRouter.get('/best-clients', getBestClients);

module.exports = contractRouter;

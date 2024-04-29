const express = require('express');
const { deposit } = require('../controller/balance.controller');
const balanceRoutes = express.Router();

balanceRoutes.post('/deposit/:userId', deposit);

module.exports = balanceRoutes;

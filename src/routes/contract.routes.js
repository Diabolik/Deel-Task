const express = require('express');
const { getContractById, getContractsByClientAndActive } = require('../controller/contract.controller');
const { getProfile } = require('../middleware/getProfile');
const contractRouter = express.Router();

contractRouter.get('/',getProfile, getContractsByClientAndActive);
contractRouter.get('/:id', getProfile, getContractById);

module.exports = contractRouter;

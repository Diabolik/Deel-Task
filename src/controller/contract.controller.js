const ContractService = require("../services/contract.service");

const getContractById = async (req, res) => {
  try {
    const contract = await ContractService.getContractById(req);
    if (!contract) {
      res.sendStatus(404);
    } else {
      res.json(contract);
    }
  } catch (error) {
    res.status(500);
  }
};

const getContractsByClientAndActive = async (req, res) => {
  try {
    const contracts = await ContractService.getContractsByClientAndActive(req);
    if (!contracts) {
      res.sendStatus(404);
    } else {
      res.json(contracts);
    }
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  getContractById,
  getContractsByClientAndActive,
};

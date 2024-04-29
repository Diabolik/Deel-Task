const BalanceService = require('../services/balance.service');

const deposit = async (req, res) => {
  try {
    console.log("amos a empezar")
    const response = await BalanceService.addFunds(req);
    if(!response.error) {
      res.json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(500).json({error: true, message: "algo sucedio" });
  }
};

module.exports = {
  deposit,
};

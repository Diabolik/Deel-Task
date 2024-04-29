const AdminService = require('../services/admin.service');

const getBestProfession = async (req, res) => {
  try {
    const foundBestProfession = await AdminService.getBestProfession(req);
    if (!foundBestProfession) {
      res.status(404);
    } else {
      res.json(foundBestProfession);
    }
  } catch (error) {
    res.status(500);
  }
};

const getBestClients = async (req, res) => {
  try {
    const foundBestClients = await AdminService.getBestClients(req);
    if (!foundBestClients) {
      res.status(404);
    } else {
      res.json(foundBestClients);
    }
  } catch (error) {
    res.status(500);
  }
};

module.exports = {
  getBestProfession, getBestClients
};

const { Op } = require("sequelize");

const getContractById = async (req) => {
  const { Contract } = req.app.get("models");
  const profileId = req.profile.id;
  const contract = await Contract.findOne({
    where: {
      id: req.params.id,
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
    },
  });
  return contract;
};

const getContractsByClientAndActive = async (req) => {
  const { Contract } = req.app.get("models");
  const profileId = req.profile.id;
  const contract = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: {
        [Op.ne]: "terminated",
      },
    },
  });
  return contract;
};

module.exports = { getContractById, getContractsByClientAndActive };


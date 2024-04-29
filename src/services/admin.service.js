const { Op } = require("sequelize");

const getBestProfession = async (req) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { startDate, endDate } = req.query;
  const sequelize = req.app.get("sequelize");

  const bestProfession = await Profile.findOne({
    attributes: ["profession", [sequelize.fn("SUM", sequelize.col("price")), "total"],
    ],
    include: [
      {
        model: Contract,
        as: "Contractor",
        attributes: [],
        include: [
          {
            model: Job,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            },
          },
        ],
      },
    ],
    where: {
      type: "contractor",
    },
    group: ["profession"],
    order: [[sequelize.col("total"), "DESC"]],
    subQuery: false,
  });

  return bestProfession;
};

const getBestClients = async (req) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { startDate, endDate, limit } = req.query;
  const sequelize = req.app.get("sequelize");

  const bestClientByPeriod = await Job.findAll({
    attributes: [[sequelize.fn("sum", sequelize.col("price")), "paid"]],
    order: [[sequelize.fn("sum", sequelize.col("price")), "DESC"]],
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Contract,
        include: [
          {
            model: Profile,
            as: "Client",
            where: { type: "client" },
            attributes: ["firstName", "lastName"],
          },
        ],
        attributes: ["ClientId"],
      },
    ],
    group: "Contract.ClientId",
    limit: limit || 2,
  });

  let bestClients = null;
  if(bestClientByPeriod) {
    bestClients = bestClientByPeriod.map(function (row) {
      return {
        id: row.Contract.ClientId,
        fullName: row.Contract.Client.firstName + " " + row.Contract.Client.lastName,
        paid: row.dataValues.totalPaid,
      };
    });
  }

  return bestClients;
};

module.exports = {
  getBestProfession, getBestClients
};

const { Op } = require("sequelize");

const getUnpaidJobs = async (req) => {
  const { Job, Contract } = req.app.get("models");
  const profileId = req.profile.id;

  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: {
        status: "in_progress",
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    },
    where: {
      [Op.or]: [{ paid: false }, { paid: null }],
    },
  });

  return jobs;
};

const generateJobPayment = async (req) => {
  const sequelize = req.app.get("sequelize");
  const { Profile, Job, Contract } = req.app.get("models");
  const { id, balance, type } = req.profile;
  const jobId = req.params.id;
  let response = { error: false, message: "" };

  const jobToPay = await Job.findOne({
    where: { id: jobId, paid: null },
    include: [
      {
        model: Contract,
        where: { status: "in_progress", ClientId: id },
      },
    ],
  });

  //If a job with all the filters was found
  if (jobToPay) {
    console.log(type);
    //If the profile is a client
    if (type == "client") {
      const amount = jobToPay.price;
      const contractorId = jobToPay.Contract.ContractorId;
      if (balance >= amount) {
        try {
          response = await sequelize.transaction(async (trns) => {
            await Profile.update(
              { balance: sequelize.literal(`balance - ${amount}`) },
              { where: { id } },
              { transaction: trns }
            );

            await Profile.update(
              { balance: sequelize.literal(`balance + ${amount}`) },
              { where: { id: contractorId } },
              { transaction: trns }
            );

            await Job.update(
              { paid: true, paymentDate: new Date() },
              { where: { id: jobId } },
              { transaction: trns }
            );
            return {
              error: false,
              message: `Excellent!: Payment (${amount}) for ${jobToPay.description} (${jobToPay.id}) applied!`,
            };
          });
        } catch (error) {
          response = {
            error: true,
            message: `Something wrong: Payment (${amount}) for ${jobToPay.description} (${jobToPay.id}) failed, please try again`,
          };
        }
      } else {
        response = {
          error: true,
          message: `Something wrong: Not enough funds`,
        };
      }
    } else {
      response = {
        error: true,
        message: `Something wrong: The profile type is not CLient`,
      };
    }
  } else {
    response = {
      error: true,
      message: "Something wrong: No job to paid",
    };
  }
  return response;
};

module.exports = {
  getUnpaidJobs,
  generateJobPayment,
};

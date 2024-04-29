const JobService = require('../services/job.service');

const getUnpaidJobs = async (req, res) => {
  try {
    const unpaidJobs = await JobService.getUnpaidJobs(req);
    if (!unpaidJobs) {
      res.sendStatus(400);
    } else {
      res.json(unpaidJobs);
    }
  } catch (error) {
    res.status(500);
  }
};

const payJob = async (req, res) => {
  try {
    const response = await JobService.generateJobPayment(req);
    if(!response.error) {
      res.json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(500).json({error: true, message: error });
  }
};

module.exports = {
  getUnpaidJobs,
  payJob,
};

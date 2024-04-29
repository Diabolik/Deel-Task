const addFunds = async (req) => {
  const { Profile, Job, Contract } = req.app.get("models");
  const clientId = req.params.userId;
  const depositAmount = req.body.amount;
  let result = { error: false, message: '' };

  try {
    const debt = await Job.sum('price', {
      where: { paid: null },
      include: [
        {
          model: Contract,
          where: { status: "in_progress", ClientId: clientId },
        },
      ],
    });

    if (debt > 0) {
      const maxPayment = debt * 0.25;
      if (depositAmount > maxPayment) {
        result = { error: true,
          message: `Something wrong: Deposit $${depositAmount} is more than 25% of client (id:${clientId}) total of jobs to pay`
        };
      } else {
        await Profile.increment(
          { balance: depositAmount },
          { where: { id: clientId }});
        result = { error: false, message: `Excellent! The funds were added successfully for the client ${clientId}` };
      }
    } else {
      result = { error: true, 
        message: `The client ${clientId} has not unpaid jobs.` }
    } 
  } catch(error) {
    console.log(error)
  }
  
  return result;
};

module.exports = { addFunds, };

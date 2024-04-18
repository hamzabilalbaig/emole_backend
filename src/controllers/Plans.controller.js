const { getPlans } = require("../services/Plans.services");

async function GetPlans(req, res, next) {
  try {
    const plans = await getPlans();
    res.status(200).json({
      success: true,
      plans: plans,
      message: "plans fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while fetching the plans" + error
        )
      );
    next(error);
  }
}

module.exports = {
  GetPlans,
};

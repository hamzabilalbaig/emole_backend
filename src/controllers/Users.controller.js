const {
  Login,
  AddUser,
  DeleteUser,
  UpdateUser,
  ResetPassword,
  GetUserById,
  forgetPassword,
  SubscribeToPlan,
} = require("../services/Users.services");

const responseFormat = (status, data, message, code) => {
  return {
    status,
    data,
    message,
    code,
  };
};

async function loginUser(req, res, next) {
  const { Email, Password } = req.body;
  try {
    const result = await Login(Email, Password);
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res
      .status(result?.status ? 200 : 400)
      .cookie("token", result?.token, options)
      .json({
        status: result?.status,
        token: result?.token,
        message: result?.message,
      });
  } catch (err) {
    console.error(false, null, "Error while logging in");
    next(err);
  }
}

async function addUser(req, res, next) {
  const { user } = req.body;
  try {
    const result = await AddUser(user);
    res.status(200).json({
      success: true,
      user: user,
      result: result,
      message: "user added successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while adding the user" + error
        )
      );
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { user } = req.body;
  try {
    const result = await UpdateUser(user, req?.user?.UserID);
    res.status(200).json({
      success: true,
      user: user,
      result: result,
      message: "user updated successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while updating the user" + error
        )
      );
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.body;
  try {
    const result = await DeleteUser(id);
    res.status(200).json({
      success: true,
      id: id,
      result: result,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while deleting the user" + error
        )
      );
    next(error);
  }
}

async function resetPassword(req, res, next) {
  const { Email } = req.user;
  const { Password } = req.body;
  try {
    const result = await ResetPassword(Email, Password);
    res.status(200).json({
      success: true,
      Email: Email,
      result: result,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while resetting the password" + error
        )
      );
    next(error);
  }
}

async function getUserById(req, res, next) {
  const { UserID } = req.user;
  try {
    const result = await GetUserById(UserID);
    res.status(200).json({
      success: true,
      id: UserID,
      result: result,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while fetching the user" + error
        )
      );
    next(error);
  }
}

async function ForgetPassword(req, res, next) {
  const { Email } = req.body;
  try {
    const result = await forgetPassword(Email);
    res.status(200).json({
      success: true,
      Email: Email,
      result: result,
      message: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while sending the email" + error
        )
      );
    next(error);
  }
}

async function subscreibeToPlan(req, res, next) {
  const { UserID } = req.user;
  const { Plan } = req.body;
  try {
    const result = await SubscribeToPlan(UserID, Plan);
    res.status(200).json({
      success: true,

      result: result,
      message: "Plan subscribed successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        responseFormat(
          false,
          error,
          "Unexpected error while sending the email" + error
        )
      );
    next(error);
  }
}

module.exports = {
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserById,
  ForgetPassword,
  subscreibeToPlan,
};

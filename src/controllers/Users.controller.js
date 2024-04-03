const { Login, AddUser, DeleteUser, UpdateUser } = require("../services/Users.services");

const responseFormat = (status, data, message, code) => {
  return {
    status,
    data,
    message,
    code,
  };
};

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const result = await Login(email, password);
    res.status(200).json({
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
    const result = await UpdateUser(user);
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

module.exports = {
  loginUser,
  addUser,
  updateUser,
  deleteUser,
};

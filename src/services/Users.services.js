const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");
const jsonwebtoken = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encryptPass(text) {
  let iv = crypto.randomBytes(IV_LENGTH);

  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decryptPass(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

async function Login(email, password) {
  try {
    if (!(email && password)) {
      throw "All input is required";
    }

    const user = await sequelizeServer.models.Users.findOne({
      where: {
        Email: {
          [Op.like]: `${email}`,
        },
      },
    });
    if (user && password === decryptPass(user.Password)) {
      const token = jsonwebtoken.sign(user?.dataValues, jwtConfig.secret);

      return {
        status: true,
        token,

        message: "Login Successful",
      };
    } else {
      return {
        status: false,
        token: null,
        user: user,
        message: "Invalid Credentials",
      };
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function AddUser(user) {
  try {
    const userDb = await sequelizeServer.models.Users.findOne({
      where: { Email: user.Email },
    });
    if (userDb != null) {
      throw "email";
    }
    let encryptedPass = encryptPass(user?.Password);
    const d = Object.assign(user, { Password: encryptedPass });

    var result = await sequelizeServer.models.Users.create(d);

    return result;
  } catch (error) {
    if (error == "email") {
      throw ". Email already exists. Please try a different email";
    }
    return error;
  }
}

async function UpdateUser(user, id) {
  try {
    const userDb = await sequelizeServer.models.Users.findOne({
      where: { UserID: id },
    });
    if (userDb == null) {
      throw "no user found";
    }
    let encryptedPass = user?.password;
    const d = Object.assign(user, { Password: encryptedPass });

    var result = await sequelizeServer.models.Users.update(d, {
      where: { UserID: id },
    });

    return result;
  } catch (error) {
    if (error == "no user found") {
      throw "no user found";
    }
    throw error;
  }
}

async function DeleteUser(id) {
  try {
    const userDb = await sequelizeServer.models.Users.findOne({
      where: { id: id },
    });
    if (userDb == null) {
      throw "no user found";
    }

    var result = await sequelizeServer.models.Users.destroy({
      where: { id: id },
    });

    return result;
  } catch (error) {
    if (error == "no user found") {
      throw "no user found";
    }
    return error;
  }
}

async function ResetPassword(email, password, oldpassword) {
  try {
    const user = await sequelizeServer.models.Users.findOne({
      where: {
        Email: {
          [Op.like]: `${email}`,
        },
      },
    });

    const oldcheck = decryptPass(user?.Password);
    if (oldcheck !== oldpassword) {
      return "Old Password you entered is incorrect";
    }
    if (user) {
      let encryptedPass = encryptPass(password);
      const d = Object.assign(user, { Password: encryptedPass });

      var result = await sequelizeServer.models.Users.update(
        { Password: encryptedPass },
        {
          where: { UserID: user.UserID },
        }
      );

      return "password changed Successfully";
    } else {
      return "no user found";
    }
  } catch (error) {
    return error;
  }
}

async function GetUserById(id) {
  try {
    const user = await sequelizeServer.models.Users.findOne({
      where: { UserID: id },
      include: [
        {
          model: sequelizeServer.models.Plans,
          as: "userplan_Plan",
        },
      ],
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function forgetPassword(email) {
  try {
    const user = await sequelizeServer.models.Users.findOne({
      where: {
        Email: {
          [Op.like]: `${email}`,
        },
      },
    });
    if (user) {
      return "Email has been sent to this User on the provided email";
    } else {
      return "No User found with the provided email";
    }
  } catch (error) {
    return error;
  }
}

async function SubscribeToPlan(userId, planId, duration) {
  try {
    var result = await sequelizeServer.models.Users.update(
      { userplan: planId },
      {
        where: { UserID: userId },
      }
    );

    const bill = await sequelizeServer?.models?.Billing?.create({
      UserID: userId,
      PlanID: planId,
      Duration: duration,
    });

    return { result, bill };
  } catch (error) {
    return error;
  }
}

async function getUserBillingInfo(id) {
  try {
    const bills = await sequelizeServer?.models?.Billing.findAll({
      UserID: id,
    });

    return bills;
  } catch (error) {
    return error;
  }
}

async function checkUserSub(UserID) {
  try {
    // Find the last billing record for the user
    const lastRecord = await sequelizeServer?.models?.Billing.findOne({
      where: {
        UserID: UserID,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: sequelizeServer?.models?.Plans,
          as: "Plan",
        },
      ], // Order by createdAt in descending order
    });

    // If no record found, user is not subscribed to anything
    if (!lastRecord) {
      return "Not subscribed to anything";
    }

    // Calculate the subscription duration
    const subscriptionDuration = parseInt(lastRecord.Duration);
    const subscriptionEndDate = new Date(lastRecord.createdAt);
    subscriptionEndDate.setDate(
      subscriptionEndDate.getDate() + subscriptionDuration
    );

    // Calculate the remaining days of the subscription
    const currentDate = new Date();
    const remainingDays = Math.ceil(
      (subscriptionEndDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    if (remainingDays <= 0) {
      return "Subscription expired";
    } else {
      return {
        subscriptionEndDate: subscriptionEndDate,
        remainingDays: remainingDays,
        subscribedPlane: lastRecord?.Plan,
      };
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  Login,
  AddUser,
  UpdateUser,
  DeleteUser,
  ResetPassword,
  GetUserById,
  forgetPassword,
  SubscribeToPlan,
  getUserBillingInfo,
  checkUserSub,
};

const { sequelizeServer } = require("../config/sequelize.config");
const { Op } = require("sequelize");
const jsonwebtoken = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");

const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encryptPass(text) {
 let iv = crypto.randomBytes(IV_LENGTH);
 
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
 let encrypted = cipher.update(text);

 encrypted = Buffer.concat([encrypted, cipher.final()]);

 return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptPass(text) {
 let textParts = text.split(':');
 let iv = Buffer.from(textParts.shift(), 'hex');
 let encryptedText = Buffer.from(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
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
        email: {
          [Op.like]: `${email}`,
        },
      },
    });
    if (user && password === decryptPass(user.password)) {
      const token = jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email,

          name: user.name,
        },
        jwtConfig.secret
      );

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
  }
}

async function AddUser(user) {
  try {
    const userDb = await sequelizeServer.models.Users.findOne({
      where: { email: user.email },
    });
    if (userDb != null) {
      throw "email";
    }
    let encryptedPass = encryptPass(user?.password);
    const d = Object.assign(user, { password: encryptedPass });

    var result = await sequelizeServer.models.Users.create(d);

    return result;
  } catch (error) {
    if (error == "email") {
      throw ". Email already exists. Please try a different email";
    }
    return error;
  }
}

async function UpdateUser(user) {
  try {
    const userDb = await sequelizeServer.models.Users.findOne({
      where: { id: user.id },
    });
    if (userDb == null) {
      throw "no user found";
    }
    let encryptedPass = (user?.password);
    const d = Object.assign(user, { password: encryptedPass });

    var result = await sequelizeServer.models.Users.update(d, {
      where: { id: user.id },
    });

    return result;
  } catch (error) {
    if (error == "no user found") {
      throw "no user found";
    }
    return error;
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

module.exports = { Login, AddUser, UpdateUser, DeleteUser};

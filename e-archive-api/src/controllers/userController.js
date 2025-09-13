const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");

exports.getAll = async (req, res) => {
  try {
    const users = await db.mydatabase.user.findAll();
    response(req, res, {
      status: 200,
      data: users,
    });
    // res.status(200).json(users);
  } catch (error) {
    response(req, res, {
      status: error.name === "SequelizeUniqueConstraintError",
      data: error,
    });
  }
};

// exports.editProfile = async (req, res) => {
//   try {
  
//   } catch (error) {
    
//   }
// }

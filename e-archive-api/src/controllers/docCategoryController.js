const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { Sequelize, where } = require('sequelize');

// models
const doc_category = db.eArchive.docCategories;

exports.addDocCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    await doc_category.create({
      name,
      description,
      created_at: req.customTimestamp,
      updated_at: req.customTimestamp,
      created_by: req.user ? req.user.nim : "DB",
      updated_by: req.user ? req.user.nim : "DB",
    });

    response(req, res, {
      status: 200,
      message: "Document category created successfully",
    });
  } catch (error) {
    response(req, res, {
      status: 500,
      message: error.message,
    });
  }
};

exports.updateDocCategory = async (req, res) => {
  try {
    let id = req.params.id;
    const { name, description } = req.body;

    const category = await doc_category.findByPk(id);
    if (!category) {
      return response(req, res, {
        status: 404,
      });
    }

    await category.update({
      name,
      description,
      updated_at: req.customTimestamp,
      updated_by: req.user ? req.user.nim : "DB",
    });

    response(req, res, {
      status: 200,
      message: "Document category updated successfully",
    });
  } catch (error) {
    response(req, res, {
      status: 500,
      message: error.message,
    });
  }
};

exports.deleteDocCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await doc_category.findByPk(id, {
      include: [{ model: db.eArchive.documents }],
    });

    if (!category) {
      return response(req, res, {
        status: 404,
        message: "Document category not found",
      });
    }

    await category.destroy();
    if (category.documents && category.documents.length > 0) {
      category.documents.forEach((doc) => {
        if (doc.file_path) {
          fs.unlink(
            path.join(__dirname, "..", "..", "uploads", doc.file_path),
            (err) => {
              if (err) console.error("Error deleting file:", err);
            }
          );
        }
      });
    }

    response(req, res, {
      status: 200,
      message: "Document category deleted successfully",
    });
  } catch (error) {
    response(req, res, {
      status: 500,
      message: error.message,
    });
  }
};

exports.getAllDocCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let filter = {};
    let searchField = ['name'];

    if (req.query.search) {
      filter = {
        [Sequelize.Op.or]: searchField.map(field => ({
          [field]: {
            [Sequelize.Op.substring]: req.query.search
          }
        })),
      }
    }

    const docCategories = await doc_category.findAndCountAll({
      where: filter,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
    });

    response(req, res, {
      status: 200,
      data: docCategories,
    });
  } catch (error) {
    response(req, res, {
      status: 500,
      message: error.message,
    });
  }
};

exports.getDocCategoryById = async (req, res) => {
  try {
    let id = req.params.id;
    const category = await doc_category.findByPk(id);

    if (!category) {
      return response(req, res, {
        status: 404,
        message: "Document category not found",
      });
    }

    response(req, res, {
      status: 200,
      data: category,
    });
  } catch (error) {
    response(req, res, {
      status: 500,
      message: error.message,
    });
  }
}

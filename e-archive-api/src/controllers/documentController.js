const { db, sequelizeInstances } = require("../../config/sequelize");
const response = require("../tools/response");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { Sequelize, where } = require('sequelize');

// models
const doc_category = db.eArchive.docCategories;
const document = db.eArchive.documents;

exports.addDocument = async (req, res) => {
    // start transaction
    const t = await sequelizeInstances.eArchive.transaction();
    try {
        const { doc_category_id, title } = req.body;
        let body = {
            doc_category_id,
            title,
            created_at: req.customTimestamp,
            updated_at: req.customTimestamp,
            created_by: req.user ? req.user.nim : "DB",
            updated_by: req.user ? req.user.nim : "DB",
            document_number: req.body.document_number || null,
        };

        if (!req.file) {
            body.file_path = req.files["document"]
                ? "/documents/" + req.files["document"][0].filename
                : null;
        }

        await document.create(body, { transaction: t });

        // commit transaction
        await t.commit();

        response(req, res, {
            status: 200,
            message: "Document created successfully",
        });
    } catch (error) {
        // rollback transaction
        await t.rollback();

        // delete uploaded file if exists
        if (req.files["document"]) {
            const filePath = path.join(
                __dirname,
                "../../uploads/documents/",
                req.files["document"][0].filename
            );
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }

        response(req, res, {
            status: 500,
            message: error.message,
        });
    }
};

exports.updateDocument = async (req, res) => {
    const t = await sequelizeInstances.eArchive.transaction();
    try {
        let id = req.params.id;
        const { doc_category_id, title } = req.body;
        let body = {
            doc_category_id,
            title,
            updated_at: req.customTimestamp,
            updated_by: req.user ? req.user.nim : "DB",
            document_number: req.body.document_number || null,
        }

        let doc = await document.findByPk(id);
        if (!doc) {
            return response(req, res, {
                status: 404,
                message: "Data not found",
            });
        }

        if (req.files && req.files["document"]) {
            console.log("INI FILE", req.files);
            body.file_path = req.files["document"]
                ? "/documents/" + req.files["document"][0].filename
                : null;

            if (doc && doc.file_path) {
                await fs.promises.unlink(
                    path.join(
                        __dirname,
                        "..",
                        "..",
                        "uploads",
                        doc.file_path
                    )
                );
            }
        }

        await doc.update(body, { transaction: t });
        await t.commit();
        response(req, res, {
            status: 200,
            message: "Document updated successfully",
        });
    } catch (error) {
        await t.rollback();
        response(req, res, {
            status: 500,
            message: error.message,
        });
    }
}

exports.deleteDocument = async (req, res) => {
    try {
        let id = req.params.id;
        let doc = await document.findByPk(id);
        if (!doc) {
            return response(req, res, {
                status: 404,
                message: "Data not found",
            });
        }
        if (doc.file_path) {
            await fs.promises.unlink(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "uploads",
                    doc.file_path
                )
            );
        }

        await doc.destroy();
        response(req, res, {
            status: 200,
            message: "Document deleted successfully",
        });
    } catch (error) {
        response(req, res, {
            status: 500,
            message: error.message,
        });
    }
}

exports.getAllDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        let filter = {};
        let searchField = ['title'];

        if (req.query.search) {
            filter = {
                [Sequelize.Op.or]: searchField.map(field => ({
                    [field]: {
                        [Sequelize.Op.substring]: req.query.search
                    }
                })),
            }
        }

        const documents = await document.findAndCountAll({
            attributes: ['id', 'document_number', 'doc_category_id', 'title', 'file_path', 'created_at'],
            include: [{
                model: doc_category,
                attributes: ['id', 'name']
            }],
            where: filter,
            limit: pageSize,
            offset,
            order: [["id", "DESC"]],
        });

        response(req, res, {
            status: 200,
            data: documents,
        });
    } catch (error) {
        response(req, res, {
            status: 500,
            message: error.message,
        });
    }
}

exports.getDocument = async (req, res) => {
    try {
        let id = req.params.id;
        let doc = await document.findByPk(id, {
            attributes: ['id', 'document_number', 'doc_category_id', 'title', 'file_path', 'created_at'],
            include: [{
                model: doc_category,
                attributes: ['id', 'name']
            }]
        });
        if (!doc) {
            return response(req, res, {
                status: 404,
                message: "Data not found",
            });
        }
        response(req, res, {
            status: 200,
            data: doc,
        });
    } catch (error) {
        response(req, res, {
            status: 500,
            message: error.message,
        });
    }
}

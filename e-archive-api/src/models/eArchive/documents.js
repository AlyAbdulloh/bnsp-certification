const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const documents = sequelize.define(
    "documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      document_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      doc_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "doc_categories",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "documents",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "fk_documents_category",
          using: "BTREE",
          fields: [{ name: "doc_category_id" }],
        },
      ],
    }
  );

  documents.associate = (models) => {
    documents.belongsTo(models.docCategories, {
      foreignKey: "doc_category_id",
    });
  };

  return documents;
};

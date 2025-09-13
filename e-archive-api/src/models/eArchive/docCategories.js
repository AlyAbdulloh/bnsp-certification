const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const docCategories = sequelize.define(
    "docCategories",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
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
      tableName: "doc_categories",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  docCategories.associate = (models) => {
    docCategories.hasMany(models.documents, { foreignKey: "doc_category_id" });
  };

  return docCategories;
};

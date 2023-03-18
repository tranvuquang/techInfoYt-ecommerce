import sequelize from "@sequelize/core";

module.exports = (sequelize: sequelize, DataTypes: any) => {
  const categories = sequelize.define("categories", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Users.associate = (models: any) => {
  //   Users.hasMany(models.Likes, {
  //     onDelete: "cascade",
  //   });

  //   Users.hasMany(models.Posts, {
  //     onDelete: "cascade",
  //   });
  // };

  return categories;
};

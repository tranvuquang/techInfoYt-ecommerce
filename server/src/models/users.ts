module.exports = (sequelize: any, DataTypes: any) => {
  const users = sequelize.define("users", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(['admin', 'user']),
      defaultValue: "user",
      allowNull: false,
    },
    address: {
      type: DataTypes.JSON,
      defaultValue: {
        country:"vietnam",
        address: "",
      },
      allowNull: false,
      get(value: any) {
        return JSON.parse(value);
      },
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

  return users;
};

module.exports = (sequelize: any, DataTypes: any) => {
  const orders = sequelize.define("orders", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    cart: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
      get(array: any) {
        const newArr = array.map((item: any) => {
          return JSON.parse(item);
        });
        return newArr;
      },
    },
    payment: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
      get(value: any) {
        return JSON.parse(value);
      },
    },
    buyer: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM([
        "not process",
        "processing",
        "shipped",
        "deliverd",
        "cancel",
      ]),
      defaultValue: "not process",
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

  return orders;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.order, {
        foreignKey: "id_user",
        as: "order"
      })

      this.hasOne(models.wallet, {
        foreignKey: "id_user",
        as: "wallet"
      })
    }
  }
  user.init({
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: DataTypes.STRING,
    address: DataTypes.STRING,
    number: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('Users', 'Owners', 'Admin'),
      allowNull: false
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user'
  });
  return user;
};
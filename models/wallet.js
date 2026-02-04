'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user"
      })

      this.hasMany(models.transaction, {
        foreignKey: "id_wallet",
        as: "transaction"
      })

      this.hasMany(models.topup, {
        foreignKey: "id_wallet",
        as: "topup"
      })
    }
  }
  wallet.init({
    id_wallet: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'wallet',
    tableName: 'wallet'
  });
  return wallet;
};
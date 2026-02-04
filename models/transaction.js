'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.wallet, {
        foreignKey: "id_wallet",
        as: "wallet"
      })

      this.belongsTo(models.order, {
        foreignKey: "id_order",
        as: "order"
      })
    }
  }
  transaction.init({
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_order: DataTypes.INTEGER,
    id_wallet: DataTypes.INTEGER,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaction',
    tableName: 'transaction'
  });
  return transaction;
};
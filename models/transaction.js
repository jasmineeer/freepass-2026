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
      // relasi transaction -> wallet (child -> parent)
      // key: id_wallet
      // parent: wallet, child: transaction
      // tipe: 1 transaction hanya mencatat 1 wallet (one to one)
      this.belongsTo(models.wallet, {
        foreignKey: "id_wallet",
        as: "wallet"
      })

      // relasi transaction -> order (child -> parent)
      // key: id_order
      // parent: order, child: transaction
      // tipe: 1 transaksi hanya mencatat 1 order (one to one)
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
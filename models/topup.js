'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class topup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi topup -> wallet (child -> parent)
      // key: id_wallet
      // parent: wallet, child: topup
      // tipe: 1 topup hanya mencatat 1 wallet (one to one)
      this.belongsTo(models.wallet, {
        foreignKey: "id_wallet",
        as: "wallet"
      })
    }
  }
  topup.init({
    id_topup: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_wallet: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    topup_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'topup',
    tableName: 'topup'
  });
  return topup;
};
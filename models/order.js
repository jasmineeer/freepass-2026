'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
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

      this.hasMany(models.detail_order, {
        foreignKey: "id_order",
        as: "detail_order"
      })

      this.hasMany(models.transaction, {
        foreignKey: "id_order",
        as: "transaction"
      })

      this.belongsTo(models.canteen, {
        foreignKey: "id_canteen",
        as: "canteen"
      })
    }
  }
  order.init({
    id_order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_customer: DataTypes.INTEGER,
    id_canteen: DataTypes.INTEGER,
    order_status: {
      type: DataTypes.ENUM('Waiting', 'Cooking', 'Ready', 'Completed'),
      allowNull: false,
      defaultValue: 'Waiting'
    },
    total: DataTypes.INTEGER,
    payment_status: {
      type: DataTypes.ENUM('Unpaid', 'Paid'),
      allowNull: false,
      defaultValue: 'Unpaid'
    },
    order_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'order',
    tableName: 'order'
  });
  return order;
};
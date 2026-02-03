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
      // relasi order -> user (child -> parent)
      // key: id_user
      // parent: user, child: order
      // tipe: 1 order hanya mencatat 1 user (one to one)
      this.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user"
      })

      // relasi order -> detail_order (parent -> child)
      // key: id_order
      // parent: order, child: detail_order
      // tipe: 1 order bisa tercatat di banyak detail_order (one to many)
      this.hasMany(models.detail_order, {
        foreignKey: "id_order",
        as: "detail_order"
      })

      // relasi order -> transaction (parent -> child)
      // key: id_order
      // parent: order, child: transaction
      // tipe: 1 order bisa tercatat di banyak transaction (one to many)
      this.hasMany(models.transaction, {
        foreignKey: "id_order",
        as: "transaction"
      })

      // relasi canteen -> order (child -> parent)
      // key: id_canteen
      // parent: canteen, child: order
      // tipe: 1 order hanya mencatat 1 canteen (one to one)
      this.belongsTo(models.id_canteen, {
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
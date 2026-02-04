'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.order, {
        foreignKey: "id_order",
        as: "order"
      })

      this.belongsTo(models.menu, {
        foreignKey: "id_menu",
        as: "menu"
      })
    }
  }
  detail_order.init({
    id_detail_order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_order: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_order',
    tableName: 'detail_order'
  });
  return detail_order;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi menu -> detail_order (parent -> child)
      // key: id_menu
      // parent: menu, child: detail_order
      // tipe: 1 menu bisa tercatat di banyak detail_order (one to many)
      this.hasMany(models.detail_order, {
        foreignKey: "id_menu",
        as: "detail_transaksi"
      })

      // relasi menu -> canteen (child -> parent)
      // key: id_canteen
      // parent: canteen, child: menu
      // tipe: 1 menu bisa tercatat di 1 canteen (one to one)
      this.belongsTo(models.canteen, {
        foreignKey: "id_canteen",
        as: "canteen"
      })
    }
  }
  menu.init({
    id_menu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_canteen: DataTypes.INTEGER,
    menu_name: DataTypes.STRING,
    menu_type: {
      type: DataTypes.ENUM('Food', 'Beverage'),
      allowNull: false 
    },
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu',
    tableName: 'menu'
  });
  return menu;
};
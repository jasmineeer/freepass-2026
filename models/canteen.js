'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class canteen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi canteen -> owner (child -> parent)
      // key: id_owner
      // parent: owner, child: canteen
      // tipe: 1 canteen bisa tercatat di 1 owner (one to one)
      this.belongsTo(models.user, {
        foreignKey: "id_owner",
        targetKey: 'id_user',
        as: "owner"
      })

      // relasi canteen -> menu (parent -> child)
      // key: id_canteen
      // parent: canteen, child: menu
      // tipe: 1 canteen bisa tercatat di banyak menu (one to many)
      this.hasMany(models.menu, {
        foreignKey: "id_canteen",
        as: "menu"
      })

      // relasi canteen -> order (parent -> child)
      // key: id_canteen
      // parent: canteen, child: order
      // tipe: 1 canteen bisa tercatat di banyak order (one to many)
      this.hasMany(models.order, {
        foreignKey: "id_canteen",
        as: "order"
      })
    }
  }
  canteen.init({
    id_canteen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_owner: DataTypes.INTEGER,
    canteen_name: DataTypes.STRING,
    rating: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'canteen',
    tableName: 'canteen'
  });
  return canteen;
};
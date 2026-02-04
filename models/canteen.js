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
      this.belongsTo(models.user, {
        foreignKey: "id_owner",
        targetKey: 'id_user',
        as: "owner"
      })

      this.hasMany(models.menu, {
        foreignKey: "id_canteen",
        as: "menu"
      })

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
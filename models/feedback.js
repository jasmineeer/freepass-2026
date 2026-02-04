'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: "id_customer",
        targetKey: 'id_user',
        as: "customer"
      })

      this.belongsTo(models.order, {
        foreignKey: "id_order",
        as: "order"
      })
    }
  }
  feedback.init({
    id_canteen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_customer: DataTypes.INTEGER,
    id_order: DataTypes.INTEGER,
    rating: DataTypes.DOUBLE,
    review: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feedback',
    tableName: 'feedback'
  });
  return feedback;
};
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
      // relasi feedback -> user (child -> parent)
      // key: id_user
      // parent: feedback, child: user
      // tipe: 1 feedback bisa tercatat di 1 user (one to one)
      this.belongsTo(models.user, {
        foreignKey: "id_customer",
        targetKey: 'id_user',
        as: "customer"
      })

      // relasi feedback -> order (child -> parent)
      // key: id_order
      // parent: feedback, child: order
      // tipe: 1 feedback bisa tercatat di 1 order (one to one)
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
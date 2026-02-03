'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order', {
      id_order: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_customer: {
        type: Sequelize.INTEGER
      },
      id_canteen: {
        type: Sequelize.INTEGER
      },
      order_status:{
        type: Sequelize.ENUM("Waiting","Cooking","Ready","Completed")
      },
      total: {
        type: Sequelize.INTEGER
      },
      payment_status:{
        type: Sequelize.ENUM("Unpaid","Paid")
      },
      order_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order');
  }
};
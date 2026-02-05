'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const pass = await bcrypt.hash('admin123', 10);

    return queryInterface.bulkInsert('user', [{
      user_name: 'Admin 01',
      address: 'Malang, East Java',
      number: '082234567844',
      role: 'Admin',
      username: 'Admin1@bccanteen',
      password: pass,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', {
      username: 'Admin1@bccanteen'
    }, {})
  }
};

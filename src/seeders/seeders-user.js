'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Alex',
      lastName: 'Sander',
      email: 'duachutthoid@gmail.com',
      password: 'fuckandgo', // you mash use hash password to project your account
      address: 'Ban Hung Mai, Xa Na Nghiu, Huyen Song Ma, tinh 26',
      gender: 1,
      roleId: 'admin',
      positionId: 'P1',
      phoneNumber: '0865858562',
      image: "null",

      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },


  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

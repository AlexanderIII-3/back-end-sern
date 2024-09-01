'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Doctor_Infor', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            paymentId: {
                allowNull: false,

                type: Sequelize.STRING
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            provinceId: {
                allowNull: false,

                type: Sequelize.STRING
            },
            addressClinic: {
                allowNull: false,

                type: Sequelize.STRING
            },
            nameClinic: {
                allowNull: false,

                type: Sequelize.STRING
            },
            note: {
                type: Sequelize.STRING
            },
            doctorId: {
                allowNull: false,

                type: Sequelize.INTEGER

            },
            clinicId: {

                type: Sequelize.INTEGER

            },
            specialtyId: {

                type: Sequelize.INTEGER

            },
            count: {
                allowNull: false,
                defaultValue: 0,
                type: Sequelize.INTEGER

            },



            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }, {
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Doctor_Infor');
    }
};
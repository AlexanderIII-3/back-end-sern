'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Markdowns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            contentHTML: {
                allowNull: false,

                type: Sequelize.TEXT('long'),
            },
            contentMarkdown: {
                allowNull: false,

                type: Sequelize.TEXT('long'),
            },
            description: {
                type: Sequelize.TEXT('long'),
                allowNull: true,

            },

            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: true,

            },
            clinicId: {
                type: Sequelize.INTEGER,
                allowNull: true,

            },
            specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: true,

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
        await queryInterface.dropTable('Markdowns');
    }
};
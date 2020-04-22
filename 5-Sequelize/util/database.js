const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node-maxim',
    'sharmarajdaksh',
    'qwe123', {
    dialect: 'mysql',
    host: 'localhost'
}
);

module.exports = sequelize;

// ALTER USER 'sharmarajdaksh'@'localhost' IDENTIFIED BY 'qwe123';
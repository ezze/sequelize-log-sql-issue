const Sequelize = require('sequelize');

const database = 'sequelize-sql-format';
const username = 'postgres';
const password = 'postgres';
const dialect = 'postgres';
const host = 'localhost';

const connection = new Sequelize(database, username, password, {
    dialect,
    host,
    define: {
        freezeTableName: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    logging: message => {
        console.log(message);
    }
});

const Task = connection.define('task', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
});

(async() => {
    await Task.sync({ force: true, logging: false });
    await Task.create({ name: 'First task', status: 1 });
    await Task.update({ status: 2 }, { where: { status: 1 }});
    await connection.connectionManager.close();
})();

const Sequelize = require('sequelize');

const config = require('./config/config').development;
const { database, username, password, dialect, host } = config;

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
    const transaction = await connection.transaction();
    try {
        await Task.create({ name: 'First task', status: 1 }, { transaction });
        await Task.bulkCreate([
            { name: 'Second task', status: 1 },
            { name: 'Third task'}
        ], { transaction });
        await Task.findAll({ where: { status: 1 }, transaction });
        await Task.update({ status: 2 }, { where: { status: 1 }, transaction });
        await transaction.commit();
    }
    catch (e) {
        await transaction.rollback();
        console.error(e);
    }
    await connection.connectionManager.close();
})();

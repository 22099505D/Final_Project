const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // 假设你已经设置了 Sequelize 实例

const PurchaseHistory = sequelize.define('PurchaseHistory', {
    // 支付记录表的字段
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  // 关联到 Users 表
            key: 'id'
        }
    },
    movieName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seats: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    purchaseDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // 默认使用当前时间
    }
});

module.exports = PurchaseHistory;

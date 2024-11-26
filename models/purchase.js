const { Sequelize, DataTypes } = require("sequelize");
const { sequelize, User } = require("./user"); // 引入 sequelize 实例和 User 模型

const PurchaseHistory = sequelize.define("PurchaseHistory", {
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: User, // 关联到 User 模型
            key: 'id',   // 关联的主键字段
        },
    },
    movieName: { type: DataTypes.STRING, allowNull: false },
    seats: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false },
}, { timestamps: true });

module.exports = PurchaseHistory;

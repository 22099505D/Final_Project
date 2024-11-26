const { Sequelize, DataTypes } = require("sequelize");

// 使用 SQLite 数据库（也可以使用 MySQL）
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/users.sqlite", // 数据库文件路径
});

// 定义用户模型
const User = sequelize.define("User", {
    userID: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    nickname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    gender: { type: DataTypes.ENUM("male", "female", "other"), allowNull: false },
    birthdate: { type: DataTypes.DATE },
    profileImage: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "user" },
}, { timestamps: true });

module.exports = { sequelize, User };

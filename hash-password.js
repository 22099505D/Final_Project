//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D

const bcrypt = require('bcrypt');

async function generateHash() {
    const plainTextPassword = 'admin123'; // 替换为管理员的真实密码
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    console.log('Hashed Password:', hashedPassword);
}

generateHash();

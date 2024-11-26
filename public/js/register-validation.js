//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D
document.getElementById("register-form").addEventListener("submit", function(event) {
    const password = document.getElementById("password").value;
    const userID = document.getElementById("userID").value;
    const notification = document.getElementById("notification");

    // 清除之前的提示信息
    notification.innerHTML = "";

    // 验证密码规则
    const passwordRegex = /^(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        event.preventDefault(); // 阻止表单提交
        notification.innerHTML = '<div class="alert alert-danger">Password must be at least 8 characters long and include a number.</div>';
        return;
    }

    // 模拟检查 User ID 唯一性
    if (userID === "existingUser") {
        event.preventDefault(); // 阻止表单提交
        notification.innerHTML = '<div class="alert alert-danger">User ID is already taken. Please choose another.</div>';
        return;
    }

    // 成功提示（可以用后端补充逻辑）
    notification.innerHTML = '<div class="alert alert-success">Registration successful!</div>';
});

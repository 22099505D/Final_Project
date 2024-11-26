//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D
document.addEventListener("DOMContentLoaded", () => {
    // 调用后端 API 获取用户信息
    fetch("/api/user-profile")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }
            return response.json();
        })
        .then((data) => {
            // 更新头像
            const avatarImg = document.querySelector(".profile-avatar img");
            avatarImg.src = data.profileImage;

            // 更新用户名
            const usernameElement = document.querySelector(".profile-info p:nth-child(1)");
            usernameElement.innerHTML = `<strong>Username:</strong> ${data.userID}`;

            // 更新邮箱
            const emailElement = document.querySelector(".profile-info p:nth-child(2)");
            emailElement.innerHTML = `<strong>Email:</strong> ${data.email}`;
        })
        .catch((error) => {
            console.error("Error loading profile:", error);
            alert("Failed to load user profile. Please try again.");
        });
});

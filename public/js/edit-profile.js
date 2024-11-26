//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D
document.addEventListener("DOMContentLoaded", () => {
    // 模拟用户数据的加载
    const mockUserData = {
        username: "ZHANG Yangxiao",
        email: "22099505D@connect.polyu.hk",
        gender: "Male",
        birthdate: "2000-01-01",
        profileImage: "/images/user-avatar.jpg",
    };

    // 预填充表单
    document.getElementById("username").value = mockUserData.username;
    document.getElementById("email").value = mockUserData.email;
    document.getElementById("gender").value = mockUserData.gender;
    document.getElementById("birthdate").value = mockUserData.birthdate;

    // 监听保存按钮
    document.getElementById("save-btn").addEventListener("click", async () => {
        const formData = new FormData(document.getElementById("edit-profile-form"));

        try {
            const response = await fetch("/update-profile", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                alert("Profile updated successfully!");
                window.location.href = "/profile"; // 修改成功后返回用户资料页面
            } else {
                alert("Failed to update profile: " + result.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred. Please try again.");
        }
    });
});

// 文件名：profile.js
//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D

document.addEventListener("DOMContentLoaded", () => {
    // 获取用户数据并更新界面
    fetch("/api/get-user-data")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 更新用户信息
                document.getElementById("profile-image").src = data.user.profileImage || "/uploads/default-avatar.png";
                document.getElementById("user-name").textContent = data.user.userID;
                document.getElementById("user-email").textContent = data.user.email;
                document.getElementById("user-gender").textContent = data.user.gender;
                document.getElementById("user-birthdate").textContent = new Date(data.user.birthdate).toLocaleDateString();
            } else {
                alert("Failed to load user data.");
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Error fetching user data. Please try again.");
        });

    // 获取用户的购买记录并渲染到界面
    fetch('/api/purchase-history')
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById('purchase-list');

            // 检查返回的数据是否为数组
            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                tableBody.innerHTML = '<tr><td colspan="4">Error loading purchase history.</td></tr>';
                return;
            }

            // 如果没有记录，显示提示
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">No purchase history found.</td></tr>';
            } else {
                // 渲染每一条购买记录
                data.forEach(record => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${record.movieName}</td>
                        <td>${record.seats}</td>
                        <td>$${record.cost.toFixed(2)}</td>
                        <td>${new Date(record.purchaseDate).toLocaleString()}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error loading purchase history:', error);
            const tableBody = document.getElementById('purchase-list');
            tableBody.innerHTML = '<tr><td colspan="4">Failed to load purchase history.</td></tr>';
        });
});

// 登出功能
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        fetch('/logout', { method: 'GET' })
            .then(() => {
                window.location.href = '/login'; // 重定向到登录页面
            })
            .catch(err => {
                console.error('Error logging out:', err);
                alert('Logout failed. Please try again.');
            });
    });
} else {
    console.error("Logout button not found.");
}

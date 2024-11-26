// 获取用户数据并渲染表格
//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D
async function fetchUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();

        const table = document.getElementById('user-table');
        table.innerHTML = ''; // 清空表格

        users.forEach((user, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.userID}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
            table.innerHTML += row;
        });
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// 删除用户
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            if (response.ok) {
                alert('User deleted successfully');
                fetchUsers(); // 重新加载用户列表
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

// 页面加载时获取用户数据
document.addEventListener('DOMContentLoaded', fetchUsers);

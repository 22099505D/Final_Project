//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D
document.addEventListener("DOMContentLoaded", () => {
    // 获取导航栏的容器
    const navbarItems = document.getElementById("navbar-items");
  
    // 发送请求获取用户状态
    fetch("/api/user-status")
      .then((response) => response.json())
      .then((data) => {
        if (data.isLoggedIn) {
          // 用户已登录，显示昵称和资料页面链接
          navbarItems.innerHTML = `
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/index">Events</a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" href="/profile">${data.user.nickname}</a>
            </li>
          `;
        } else {
          // 用户未登录，显示默认导航栏
          navbarItems.innerHTML = `
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/index">Events</a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" href="/login">User</a>
            </li>
          `;
        }
      })
      .catch((error) => {
        console.error("Error loading navbar:", error);
      });
  });
  


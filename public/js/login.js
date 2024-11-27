// login.js
const loginForm = document.querySelector('form');
const keepLoggedInCheckbox = document.querySelector('#keepLoggedIn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const keepLoggedIn = keepLoggedInCheckbox.checked;

    const loginData = {
        username,
        password,
        keepLoggedIn
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/profile';
        } else {
            console.log('登录失败');
        }
    });
});

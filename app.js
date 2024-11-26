//WU Zekun 22097852D
//ZHANG Yangxiao 22099505D

const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;
const session = require("express-session");
const { sequelize, User } = require("./models/user");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

// 同步数据库
sequelize.sync()
    .then(() => console.log("Database synced successfully"))
    .catch(err => console.error("Error syncing database:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// File upload configuration
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 确保上传目录存在
        cb(null, uploadsDir); 
    },
    filename: (req, file, cb) => {
        // 使用唯一的时间戳 + 原始文件名
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Home Page Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "Home.html"));
});

// Register Page Route
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.post("/register", upload.single("profileImage"), async (req, res) => {
    const { userID, password, nickname, email, gender, birthdate } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({
            userID,
            password: hashedPassword,
            nickname,
            email,
            gender,
            birthdate,
            profileImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        req.session.user = newUser;
        console.log("User registered:", newUser);
        res.redirect("/profile");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user. Please try again.");
    }
});

// Profile Page Route
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        console.error("No user in session, redirecting to login");
        return res.redirect('/login');
    }

    console.log("Loading profile for:", req.session.user);
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});




// Login Page Route
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找用户
        const user = await User.findOne({ where: { userID: username } });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid username or password');
        }

        // 保存用户信息到 session
        req.session.user = {
            id: user.id,
            userID: user.userID,
            nickname: user.nickname,
            role: user.role, // 将用户角色信息也存入 session
        };

        console.log('User logged in:', req.session.user);

        // 根据角色跳转
        if (user.role === 'admin') {
            return res.redirect('/admin'); // 管理员跳转到 /admin
        } else {
            return res.redirect('/profile'); // 普通用户跳转到 /profile
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Event Management Routes
app.get("/payment", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "payment.html"));
});

app.get("/seat-management", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "seat-management.html"));
});

app.get("/event-management", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "event-management.html"));
});

app.get("/booking", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "booking.html"));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Home.html'));
});


// API Route to Check User Login Status
app.get("/api/user-status", (req, res) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/get-user-data', (req, res) => {
    if (!req.session.user) {
        console.error("No user in session.");
        return res.status(401).json({ success: false, message: "User not logged in." });
    }

    // 假设 req.session.user 存储的是登录用户的基本信息
    const userId = req.session.user.id;

    User.findOne({ where: { id: userId } })
        .then(user => {
            if (!user) {
                console.error("User not found.");
                return res.status(404).json({ success: false, message: "User not found." });
            }

            res.json({
                success: true,
                user: {
                    userID: user.userID,
                    email: user.email,
                    gender: user.gender,
                    birthdate: user.birthdate,
                    profileImage: user.profileImage || "/uploads/default-avatar.png"
                }
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            res.status(500).json({ success: false, message: "Error fetching user data." });
        });
});

app.get('/edit-profile', (req, res) => {
    // 检查用户是否已登录
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // 如果未登录，则跳转到登录页面
    }

    res.sendFile(path.join(__dirname, 'views', 'edit-profile.html')); // 返回编辑页面
});





// 用户头像上传配置
const profileImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/profile-images"); // 上传目录
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});
const profileImageUpload = multer({ storage: profileImageStorage });

app.post("/update-profile", upload.single("profileImage"), async (req, res) => {
    const { username, email, gender, birthdate } = req.body;
    const userId = req.session.user.id; // 假设用户已经登录

    try {
        const updatedUser = await User.update(
            {
                userID: username,
                email: email,
                gender: gender,
                birthdate: birthdate,
                profileImage: req.file ? `/uploads/${req.file.filename}` : req.session.user.profileImage,
            },
            { where: { id: userId } }
        );

        if (updatedUser) {
            req.session.user = { ...req.session.user, username, email, gender, birthdate };
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Failed to update user." });
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



// Admin页面路由
app.get('/admin', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API 路由：获取所有用户信息
app.get('/api/admin/users', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    try {
        const users = await User.findAll({
            attributes: ['id', 'userID', 'email', 'role'], // 只返回必要字段
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API 路由：删除用户
app.delete('/api/admin/users/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    try {
        const userId = req.params.id;
        await User.destroy({ where: { id: userId } });
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    // 清除 session 数据
    req.session.destroy((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Failed to logout.");
        }
        // 重定向到登录页面
        res.redirect('/login');
    });
});




// 静态页面路由
app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'booking.html'));
});

app.get('/event-management', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'event-management.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

app.post('/payment', async (req, res) => {
    const { seat, cost, movie } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).send('Unauthorized');
    }

    try {
        // 将记录插入 PurchaseHistory 表
        await PurchaseHistory.create({
            userId: userId,
            movieName: movie,
            seats: seat,
            cost: parseFloat(cost),
        });

        res.status(200).send('Payment Successful');
    } catch (error) {
        console.error('Error saving purchase history:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/seat-management', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'seat-management.html'));
});

app.post('/confirm-booking', (req, res) => {
    const { movie, seats } = req.body;
    console.log(`Booking confirmed for movie: ${movie}, seats: ${seats}`);
    res.send('Booking successful!');
});

// 定义 Purchase History API 路由
app.get('/api/purchase-history', (req, res) => {
    const userId = req.session.user?.id; // 获取用户 ID
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const filePath = path.join(__dirname, 'data', 'purchaseHistory.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading purchase history file:', err);
            return res.status(500).json({ success: false, message: 'Error reading file' });
        }

        let purchaseHistory = {};
        if (data) {
            try {
                purchaseHistory = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).json({ success: false, message: 'Error parsing file' });
            }
        }

        // 返回当前用户的购买记录
        const userPurchases = purchaseHistory[userId] || [];
        res.json(userPurchases);
    });
});


const { Purchase } = require('./models/user'); // 修改路径为实际模型路径
const PurchaseHistory = require("./models/purchase"); // 正确路径
sequelize.sync({ alter: true })
    .then(() => console.log("Database synced successfully"))
    .catch(err => console.error("Error syncing database:", err));



    
    
    
    app.post('/api/save-purchase', (req, res) => {
        const userId = req.session.user?.id; // 获取用户 ID
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    
        const { movieName, seats, cost, purchaseDate } = req.body; // 获取购买数据
        const newPurchase = { movieName, seats, cost, purchaseDate };
    
        const filePath = path.join(__dirname, 'data', 'purchaseHistory.json');
    
        // 读取 JSON 文件
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading purchase history file:', err);
                return res.status(500).json({ success: false, message: 'Error reading file' });
            }
    
            let purchaseHistory = {};
            if (data) {
                try {
                    purchaseHistory = JSON.parse(data); // 解析 JSON 文件
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    return res.status(500).json({ success: false, message: 'Error parsing file' });
                }
            }
    
            // 添加记录到当前用户
            if (!purchaseHistory[userId]) {
                purchaseHistory[userId] = [];
            }
            purchaseHistory[userId].push(newPurchase);
    
            // 写回 JSON 文件
            fs.writeFile(filePath, JSON.stringify(purchaseHistory, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing purchase history file:', err);
                    return res.status(500).json({ success: false, message: 'Error saving file' });
                }
    
                res.json({ success: true, message: 'Purchase saved successfully' });
            });
        });
    });
    
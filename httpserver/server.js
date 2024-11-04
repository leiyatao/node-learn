const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL 连接设置
const connection = mysql.createConnection({
    host: '192.168.229.26',
    user: 'root',  // 替换为你的 MySQL 用户名
    password: 'root',  // 替换为你的 MySQL 密码
    database: 'test'
});

connection.connect((err) => {
    if (err) {
        console.error('数据库连接错误: ' + err.stack);
        return;
    }
    console.log('已连接到数据库');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));

// 提供 HTML 页面
app.get('/css3', (req, res) => {
    res.render('css3')
});

// 提供 HTML 页面
app.get('/', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            return res.status(500).send('数据库查询错误');
        }
        res.render('index', { users: results }); // 渲染页面并传递用户数据
    });
});

// 处理 POST 请求
app.post('/api/users', (req, res) => {
    const { name, age } = req.body; // 获取请求体数据
    const query = 'INSERT INTO users (name, age) VALUES (?, ?)';
    connection.query(query, [name, age], (error, results) => {
        if (error) {
            console.error('插入错误: ' + error.stack);
            return res.status(500).send('插入错误');
        }
        res.redirect('/'); // 插入成功后重定向到主页
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
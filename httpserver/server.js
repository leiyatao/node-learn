const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// MySQL 连接设置
const pool = mysql.createPool({
    host: '192.168.229.26',
    user: 'root',  // 替换为你的 MySQL 用户名
    password: 'root',  // 替换为你的 MySQL 密码
    database: 'test',
    connectTimeout: 10000,  // 设置连接超时时间（单位：毫秒）
    acquireTimeout: 10000,  // 设置获取连接的超时时间
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 使用 promise() 获取数据库连接池
const promisePool = pool.promise();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));

// 提供 HTML 页面
app.get('/css3', (req, res) => {
    res.render('css3')
});

// 提供 HTML 页面
app.get('/', async (req, res) => {
    try {
      const [rows, fields] = await promisePool.query('SELECT * FROM users');
      res.render('index', { users: rows }); // 渲染页面并传递用户数据
    } catch (error) {
      console.error('数据库查询错误:', error.message);
      res.status(500).send('数据库查询错误');
    }
  });

// 处理 POST 请求
app.post('/api/users', async (req, res) => {
    const { name, age } = req.body; // 获取请求体数据
    const query = 'INSERT INTO users (name, age) VALUES (?, ?)';
    
    try {
        // 使用 Promise 来执行数据库插入
        const [results] = await promisePool.query(query, [name, age]);
        res.redirect('/'); // 插入成功后重定向到主页
    } catch (error) {
        console.error('插入错误: ' + error.stack);
        return res.status(500).send('插入错误');
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
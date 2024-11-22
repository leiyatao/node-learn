const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
// 加载 .env 文件
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT = 3000;
const promisePool = require('./dbutil'); // 引入数据库连接池



const appid=process.env.APPID
const appsecret=process.env.SECRET

console.log(appid)



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
// 使用 express 自带的 JSON 解析中间件
app.use(express.json());  // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析表单请求（urlencoded）
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

// 处理 POST 请求
app.post('/api/add/users', async (req, res) => {
  const { name, age } = req.body; // 获取请求体数据
  const query = 'INSERT INTO users (name, age) VALUES (?, ?)';
  
  try {
      // 使用 Promise 来执行数据库插入
      const [results] = await promisePool.query(query, [name, age]);
      return res.status(200).send({'code':0,'message':'插入成功'});
  } catch (error) {
      console.error('插入错误: ' + error.stack);
      return res.status(500).send('插入错误');
  }
});
// 查询用户列表
app.get('/api/users/list', async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query('SELECT * FROM users');

    return res.status(200).send({ users: rows }); // 渲染页面并传递用户数据
  } catch (error) {
    console.error('数据库查询错误:', error.message);
    res.status(500).send('数据库查询错误');
  }
});
//获取用户openId
app.get('/api/users/getOpenId', async (req, res) => {

    const js_code=req.query.js_code;
    console.log(req.query.js_code);
    console.log(appid);
    console.log(appsecret);
    console.log(js_code);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&grant_type=authorization_code&js_code=${js_code}`;
    // 使用 axios 发起 GET 请求
      axios.get(url)
        .then((response) => {
          console.log(response.data);  // 打印响应内容
          // 你可以在这里处理返回的数据，例如获取 openid
          return res.status(200).send({ data:response.data }); // 渲染页面并传递用户数据
        })
        .catch((error) => {
          console.error('请求错误:', error);
        });
  
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
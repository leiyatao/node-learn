const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
// 加载 .env 文件
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT = 3000;
const promisePool = require('./dbutil'); // 引入数据库连接池
require('./api/user');



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
      const [rows, fields] = await promisePool.query('SELECT id,name,email,create_date FROM wx_users');
      res.render('index', { users: rows }); // 渲染页面并传递用户数据
    } catch (error) {
      console.error('数据库查询错误:', error.message);
      res.status(500).send('数据库查询错误');
    }
  });

// 处理 POST 请求
app.post('/api/users', async (req, res) => {
    const { name, pass ,email} = req.body; // 获取请求体数据
    const query = 'INSERT INTO wx_users (name, email,pass) VALUES (?, ?,?)';
    
    try {
        // 使用 Promise 来执行数据库插入
        const [results] = await promisePool.query(query, [name, email,pass]);
        res.redirect('/'); // 插入成功后重定向到主页
    } catch (error) {
        console.error('插入错误: ' + error.stack);
        return res.status(500).send('插入错误');
    }
});

// 处理 POST 请求
app.post('/api/add/users', async (req, res) => {
  const { name, email,pass } = req.body; // 获取请求体数据
  const query = 'INSERT INTO wx_users (name, email,pass) VALUES (?, ?)';
  
  try {
      // 使用 Promise 来执行数据库插入
      const [results] = await promisePool.query(query, [name, email,pass]);
      return res.status(200).send({'code':0,'message':'插入成功'});
  } catch (error) {
      console.error('插入错误: ' + error.stack);
      return res.status(500).send('插入错误');
  }
});
// 查询用户列表
app.get('/api/users/list', async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query('SELECT * FROM wx_users');

    return res.status(200).send({ users: rows }); // 渲染页面并传递用户数据
  } catch (error) {
    console.error('数据库查询错误:', error.message);
    res.status(500).send('数据库查询错误');
  }
});
// 分页查询用户列表
app.get('/api/users/listPage', async (req, res) => {
  try {
    // 从请求参数中获取页码和每页显示的记录数，默认为第一页和10条数据
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    console.log("page:"+page,"pageSize:"+pageSize)
    // 计算偏移量
    const offset = (page - 1) * pageSize;

    // 查询总数，用于计算总页数
    const [totalRows] = await promisePool.query('SELECT COUNT(*) AS total FROM wx_users');
    console.log(totalRows)
    // 根据分页参数查询数据
    const [rows] = await promisePool.query(
      'SELECT id,name,email,create_date FROM wx_users ORDER BY create_date DESC LIMIT ? OFFSET ?', 
      [pageSize, offset]
    );

    // 计算总页数
    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / pageSize);

    return res.status(200).send({
      users: rows,      // 当前页的用户数据
      page,             // 当前页码
      pageSize,         // 每页显示的数据条数
      total,            // 总数据条数
      totalPages       // 总页数
    });
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

//用户注册
app.post('/api/users/register', async (req, res) => {
  const { name, pass,email } = req.body; // 获取请求体数据
  console.log('name:'+name)
  console.log('pass:'+pass)
  console.log('email:'+email)
  const query = 'insert into wx_users(name,email,pass) values(?,?,md5(?))';
  
  try {
      // 使用 Promise 来执行数据库插入
      const [results] = await promisePool.query(query, [name ,email,pass]);
      return res.status(200).send({'code':0,'message':'插入成功'});
  } catch (error) {
      console.error('插入错误: ' + error.stack);
      return res.status(500).send('插入错误');
  }
});




// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
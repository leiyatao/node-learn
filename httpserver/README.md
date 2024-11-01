# node-learn

## node服务操作mysql数据库

### 示例：通过 HTML 提交数据到 MySQL

1. **安装依赖**：

   首先，确保安装必要的依赖：

   ```bash
   npm install express mysql2 body-parser ejs
   ```

2. **设置 MySQL**：

   确保你已安装并运行 MySQL，并创建一个数据库（例如 `test`）以及表（例如 `users`）：

   ```sql
   CREATE DATABASE test;
   USE test;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       age INT NOT NULL
   );
   ```

3. **创建文件结构**：

   创建如下文件结构：

   ```
   /your_project_folder
   ├── server.js
   └── views
       ├── index.ejs
   ```

4. **创建 HTML 表单 (EJS 文件)**：

   在 `views` 文件夹中，创建 `index.ejs` 文件，内容如下：

   ```ejs
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>用户注册</title>
   </head>
   <body>
       <h1>用户注册</h1>
       <form method="POST" action="/api/users">
           <label for="name">姓名:</label>
           <input type="text" id="name" name="name" required>
           <br>
           <label for="age">年龄:</label>
           <input type="number" id="age" name="age" required>
           <br>
           <button type="submit">提交</button>
       </form>
       <h2>保存的数据:</h2>
       <ul>
           <% users.forEach(function(user) { %>
               <li><%= user.name %> - <%= user.age %>岁</li>
           <% }); %>
       </ul>
   </body>
   </html>
   ```

5. **创建 Node.js 服务器**：

   在 `server.js` 文件中，添加以下代码：

   ```javascript
   const express = require('express');
   const mysql = require('mysql2');
   const bodyParser = require('body-parser');
   const path = require('path');

   const app = express();
   const PORT = 3000;

   // MySQL 连接设置
   const connection = mysql.createConnection({
       host: 'localhost',
       user: 'your_username',  // 替换为你的 MySQL 用户名
       password: 'your_password',  // 替换为你的 MySQL 密码
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
   app.use(bodyParser.urlencoded({ extended: true }));

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
   ```

6. **启动服务器**：

   在终端中运行以下命令启动服务器：

   ```bash
   node server.js
   ```

7. **访问页面**：

   打开浏览器并访问 `http://localhost:3000`。填写表单并提交。

### 结果

- 提交表单后，用户数据将保存到 MySQL 数据库中。
- 页面将自动刷新并显示所有保存的数据。

### 总结

- 使用 EJS 模板引擎动态渲染 HTML 页面，并从数据库查询用户数据。
- 通过 POST 请求将表单数据保存到 MySQL 数据库，并在成功后重定向到主页。确保在运行代码之前替换为正确的数据库连接信息。

# node-learn 目录
* [fs 文件操作](https://github.com/leiyatao/node-learn/tree/master/fs)

* [httpserver Web服务相关](https://github.com/leiyatao/node-learn/tree/master/httpserver)




 wget https://nodejs.org/dist/v18.20.4/node-v18.20.4-linux-x64.tar.xz
 mkdir -p /usr/local/nodejs
 tar -Jxvf node-v18.20.4-linux-x64.tar.xz -C /usr/local/nodejs/<br>
 #写入环境变量
 echo "export PATH=/usr/local/nodejs/node-v18.20.4-linux-x64/bin:$PATH" >> /etc/profile
 source /etc/profile<br>
 #查看版本信息
 node -v
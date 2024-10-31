// 解决01-fs.js中只能在当前工作路径执行的问题
const {log} = require('console')
const path = require('path')
const p1 = path.join('C:/','Users','username/abc','./file.txt')
log(p1)
const p2 = path.win32.join('C:/','Users','username/abc','./file.txt')
log(p2)
log(__filename) // 当前文件路径
log(__dirname)  // 当前目录路径
const {log} = require('console')
const fs = require('fs')
/**************同步读操作*************** */
//const syncResult = fs.readFileSync('note.txt')
// log(syncResult)
// log(syncResult.toString())
// log(fs.readFileSync('notebig.txt',{encoding:'utf-8'}))
// log('后续功能')

/**************异步读操作*************** */
// fs.readFile('note.txt',(err,result)=>{
//     // log(result.toString())
// })

/**************异步读操作*************** */
// const {readFile} =require('fs/promises')
// readFile('note.txt')
// .then(result=>{
//     // log(result.toString())
// })

// /**************流式读操作*************** */
// const bigText= fs.createReadStream('notebig.txt',{encoding:'utf-8'})
// bigText.on('data',chunk=>{
//     // log(chunk,1234567890)
// })

// bigText.on('end',()=>{
//     // log('数据接收完毕')
// })

/**************写文件操作*************** */
// fs.writeFileSync('writeFile.txt','大家好，我使用nodejs进行写文件操作\n') // 覆盖写入
// fs.writeFileSync('writeFile.txt','文件写入操作完成\n',{flag:'a'}) // flag:'a' 追加写入
// fs.appendFileSync('writeFile.txt','使用appendFileSync追加文件写入操作完成')

// 写文件前进行文件目录检查，如果没有就创建
// const dirPath='aaa/bbb/ccc';
// if(!fs.existsSync(dirPath)){
//     fs.mkdirSync(dirPath, {recursive:true}) // 通过递归创建多级目录
// }
// fs.writeFileSync(dirPath+'/newFile.txt','创建文件夹目录并写入文件')

// // 通过流进行写文件操作
// const ws=fs.createWriteStream('wswrite.txt',{flags:'a'}) // {flags:'a'} 追加写入操作
// ws.on('open',()=>{
//     Array(5000).fill().map((item,index)=>{
//         ws.write(index+1+"两个黄鹂鸣翠柳\n")
//     })
//     ws.end() // 关闭文件流
// })
// ws.on('finish',()=>{
//     log('数据写入成功')
// })


/**************文件夹及其文件删除，重命名等操作*************** */
const dirname='aaa'
const files = fs.readdirSync(dirname)
let num = 1
files.forEach(filename=>{
    const filePath = dirname+'/'+filename
    const stat = fs.statSync(filePath)
    if(stat.isFile() && stat.size<1024){
        fs.unlinkSync(filePath)
        log(`已删除小文件${filename}`)
    } else if(stat.isFile()){
        let fileNo=num<10?'0'+num:num
        fs.renameSync(filePath,dirname+'/'+`${fileNo}号文件.txt`)
        log(`将${filePath}重命名为${fileNo}号文件.txt`)
        num++
    } else if (stat.isDirectory()){
        fs.rmSync(filePath,{recursive:true,force:true}) //recursive:true 递归删除 force:true强制删除
        log(`${filePath}目录已删除`)
    }
})

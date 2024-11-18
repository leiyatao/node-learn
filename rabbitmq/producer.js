const amqp = require('amqplib')

async function sendMessage(){
    try {
        //连接到RabbitMQ服务区
        const connection = await amqp.connect('amqp://192.168.233.35/bs')
        const channel = await connection.createChannel()
        const queue = 'hello'//队列名称
        const message = 'Hello World!'
        // 确保队列存在
        await channel.assertQueue(queue,{
            durable:false,//队列是否持久化
        })
        //发送消息到队列
        channel.sendToQueue(queue,Buffer.from(message))
        console.log("[x] Sent %s",message)
        //关闭连接和通道
        setTimeout(() => {
            channel.close();
            connection.close();
        }, 500);
    } catch (error) {
        console.error("Error:",error)
    }
}
sendMessage();
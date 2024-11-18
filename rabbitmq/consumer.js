const amqp = require('amqplib');

async function receiveMessage() {
  try {
    // 连接到 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://192.168.233.35/bs');
    const channel = await connection.createChannel();

    const queue = 'hello'; // 队列名称

    // 确保队列存在
    await channel.assertQueue(queue, {
      durable: false, // 队列是否持久化
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    // 从队列中接收消息
    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(" [x] Received %s", msg.content.toString());
      }
    }, {
      noAck: true, // 自动确认消息
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

receiveMessage();
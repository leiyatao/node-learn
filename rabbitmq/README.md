# nodejs 连接rabbitmq


在 Node.js 中连接 RabbitMQ 通常使用 [amqplib](https://www.npmjs.com/package/amqplib) 这个库，它是一个用于与 RabbitMQ 进行交互的客户端库。

下面是一个简单的示例，展示如何使用 Node.js 连接到 RabbitMQ、发送消息和接收消息。

### 1. 安装 amqplib

首先，你需要在你的项目中安装 `amqplib`：

```bash
npm install amqplib
```

### 2. 连接到 RabbitMQ 并发送/接收消息

#### 发送消息（Producer）

下面是一个示例，展示了如何向一个 RabbitMQ 队列中发送消息。

```javascript
const amqp = require('amqplib');

async function sendMessage() {
  try {
    // 连接到 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'hello'; // 队列名称
    const message = 'Hello World!';

    // 确保队列存在
    await channel.assertQueue(queue, {
      durable: false, // 队列是否持久化
    });

    // 发送消息到队列
    channel.sendToQueue(queue, Buffer.from(message));

    console.log(" [x] Sent %s", message);

    // 关闭连接和通道
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error:", error);
  }
}

sendMessage();
```

#### 接收消息（Consumer）

下面是一个示例，展示了如何从 RabbitMQ 队列中接收消息。

```javascript
const amqp = require('amqplib');

async function receiveMessage() {
  try {
    // 连接到 RabbitMQ 服务器
    const connection = await amqp.connect('amqp://localhost');
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
```

### 3. 运行代码

1. 先启动 RabbitMQ 服务，通常可以通过 Docker 或在本地安装 RabbitMQ 来运行。

   如果你在 Docker 中运行 RabbitMQ，可以使用如下命令：

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
   ```

   这会启动一个带有管理界面的 RabbitMQ 实例，管理界面默认可以通过 [http://localhost:15672](http://localhost:15672) 访问，默认用户名和密码是 `guest`。

2. 先运行接收消息的脚本（Consumer）。

   ```bash
   node receiveMessage.js
   ```

3. 然后运行发送消息的脚本（Producer）。

   ```bash
   node sendMessage.js
   ```

当你运行发送消息的脚本时，接收消息的脚本将会收到并打印出消息。

### 4. 配置和其他设置

- **RabbitMQ 连接字符串**: `amqp://localhost` 是连接到本地 RabbitMQ 实例的默认连接字符串。如果你的 RabbitMQ 服务在其他机器上运行，或者需要用户名和密码进行身份验证，你可以使用类似这样的 URL：`amqp://username:password@hostname:port`。
  
- **持久化队列**: 如果你希望队列在 RabbitMQ 重启后仍然存在并保存消息，可以将 `durable: true` 设置为队列的属性。但是，这会影响性能和消息确认行为。

- **消息确认**: 在上面的代码中，`noAck: true` 表示自动确认收到消息。如果需要显式确认消息，可以使用 `channel.ack(msg)` 进行手动确认。

### 5. 常见问题和错误

- **连接错误**: 如果 RabbitMQ 连接失败，确保 RabbitMQ 服务正在运行并且你使用的是正确的连接 URL。
- **权限问题**: 如果你使用的是自定义用户名和密码，确保该用户有足够的权限来访问相应的队列和交换机。
- **消息丢失**: 如果你使用 `durable: false`，队列在 RabbitMQ 重启后会丢失消息。可以将其改为 `true` 来保证队列的持久化。

通过这些步骤，你可以轻松地在 Node.js 中与 RabbitMQ 进行交互。
const {Kafka,Partitioners} = require('kafkajs')

//创建Kafka客户端
const kafka = new Kafka({
    clientId:'my-app',  //客户端标识
    brokers:['192.168.233.39:2181'],//Kafka Broker地址 localhost:9092
})

//创建消费者
const consumer = kafka.consumer({
    groupId:'my-group',//消费者所属的消费组
    createPartitioner: Partitioners.LegacyPartitioner,//旧版本kafka才需要配置

}); 

// 启动消费者并消费消息
const runConsumer = async()=>{
    await consumer.connect();
    console.log('Kafka 消费者已连接');

    //订阅kafka主题
    await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
    
    //消费消息
    await consumer.run({
        eachMessage: async({topic,partition, message})=>{
            console.log(`接收到消息：${message.value.toString()}`)
        }
    })
}

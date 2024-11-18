const { Kafka,Partitioners } = require('kafkajs')

//创建kafka客户端
const kafka = new Kafka({
    clientId:'my-app',  //客户端标识
    brokers:['192.168.233.39:2181'],//Kafka Broker地址 localhost:9092
})

//创建生产者
const producer = kafka.producer({
    createPartitioner:Partitioners.LegacyPartitioner,
});
//启动生产者并发送消息
const runProducer = async()=>{
    await producer.connect();
    console.log('Kafka生产者已接连')

    try {
        await producer.send({
            topic:'my-topic', //发动到的Kafka主题
            messages:[
                {value:'Hello Kafka!'},
                {value: 'Another message'},
            ]
        })
        console.log('消息已发送')
    } catch (error) {
        console.error('发送消息失败：',error)
    } finally {
        await producer.disconnect();
        console.log('Kafka生产者已断开连接')
    }
}

runProducer();
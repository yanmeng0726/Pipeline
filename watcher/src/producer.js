import kafka from 'kafka-node';

const client = new kafka.KafkaClient(process.env.ZOOKEEPER, 'producer-client');

const producer = new kafka.HighLevelProducer(client);
producer.on('ready', function () {
  console.log('Kafka Producer is connected and ready.');
});


producer.on('error', function (error) {
  console.error(error);
});

const KafkaService = {
  sendRecord: (payload, callback = () => {}) => {
    const buffer = new Buffer.from(JSON.stringify(payload));

    const record = [
      {
        topic: process.env.TOPIC,
        messages: buffer,
        attributes: 1 
      }
    ];

    producer.send(record, callback);
  }
};

export default KafkaService;

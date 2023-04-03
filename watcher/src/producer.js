import kafka from 'kafka-node';

const client = new kafka.KafkaClient('http://localhost:2181', 'producer-client');

const producer = new kafka.HighLevelProducer(client);
producer.on('ready', function () {
  console.log('Kafka Producer is connected and ready.');
});

// For this demo we just log producer errors to the console.
producer.on('error', function (error) {
  console.error(error);
});

const KafkaService = {
  sendRecord: (payload, callback = () => {}) => {
    const buffer = new Buffer.from(JSON.stringify(payload));

    const record = [
      {
        topic: 'pipeline',
        messages: buffer,
        attributes: 1 /* Use GZip compression for the payload */
      }
    ];

    //Send record to Kafka and log result/error
    producer.send(record, callback);
  }
};

export default KafkaService;

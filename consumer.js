const kafka = require('kafka-node');

class Kafka {
  constructor(options, cOptions, topic) {
    return new Promise((res, rej) => {
      try {
        this.Consumer = kafka.ConsumerGroup;
        this.kafkaTopic = topic;
        this.client = new kafka.KafkaClient(options);
        this.consumer = new this.Consumer(
          cOptions,
          this.kafkaTopic,
        );
        this.consumer.on('error', (err) => {
          console.log('error', err);
        });
        res(this);
      } catch (err) {
        rej(err);
      }
    });
  }

  checkReady(callback) {
    this.producer.on('ready', async () => {
      callback();
    });
  }

  recieveMessage(callback) {
    this.consumer.on('message', async (message) => {
      callback(message);
    });
  }
}

async function subscribe(options, cOptions, topic, callback) {
  if (!Array.isArray(topic)) {
    throw new Error('Enter a valid topic.Must be a array');
  } else {
    await new Kafka(options, cOptions, topic)
      .then((data) => {
        data.recieveMessage(callback);
      })
      .catch(err => console.log(err));
  }
}

module.exports = { subscribe };

const kafka = require('kafka-node');
const async = require('async');

class Kafka {
  constructor(options, poptions, topic) {
    return new Promise((res, rej) => {
      try {
        this.Producer = kafka.HighLevelProducer;
        this.kafkaTopic = topic;
        this.client = new kafka.KafkaClient(options);
        this.producer = new this.Producer(this.client, poptions);
        this.producer.on('error', (err) => {
          console.log(`[kafka-producer -> ${this.kafkaTopic}]: connection errored`, err);
          throw err;
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

  pushMessage(messages, callback) {
    const payloads = [];
    async.map(messages, (message, cb) => {
      payloads.push({
        topic: this.kafkaTopic,
        //  messages: typeof (message) === 'string' ? message : JSON.stringify(message),
        messages: message,
      });
      cb();
    }, (err) => {
      if (err) throw err;
      else {
        this.checkReady(() => {
          this.client.refreshMetadata([this.kafkaTopic], (mdrefreshErr) => {
            if (mdrefreshErr) throw new Error('Error fetching metadata');
            else {
              this.producer.send(payloads, (sendErr) => {
                if (sendErr) {
                  console.log(sendErr, `[kafka-producer -> ${this.kafkaTopic}]: broker update failed`);
                } else {
                  console.log(`[kafka-producer -> ${this.kafkaTopic}]: broker update success`);
                  if (callback) callback();
                  this.producer.close();
                }
              });
            }
          });
        });
      }
    });
  }
}

async function sendMessage(options, poptions, message, topic, callback) {
  if (!Array.isArray(message)) {
    throw new Error('Param pass must be of type array');
  } else if (typeof (topic) !== 'string' || topic.trim() === '') {
    throw new Error('Enter a valid topic');
  } else {
    await new Kafka(options, poptions, topic)
      .then((data) => {
        data.pushMessage(message, callback);
      })
      .catch(err => console.log(err));
  }
}

module.exports = { sendMessage };

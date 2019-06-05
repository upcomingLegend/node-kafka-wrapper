<h1 id="node-kafka-wrapper">Node-kafka-wrapper</h1>
<p>Kafka-node-wrapper is a custom wrapper built around the <strong>npm</strong> module <strong>kafka-node</strong>. It tries to simplify the complexities of implementing the boiler-plate and helps in focusing on the development of the application. It aims at a <strong>configure and use</strong> kind of strategy where in the developer just needs to setup the configuration of the client, producer/consumer.</p>
<h2 id="features">Features</h2>
<ul>
<li>Consumer Groups</li>
<li>High Level Producer</li>
<li>SSL based connections on Kafka 0.9 +</li>
<li>SASL/PLAIN based connections Kafka 0.10 +</li>
</ul>
<h2 id="kafka-setup-and-installation">Kafka setup and installation</h2>
<p>Kafka can be installed and setup by following the official <a href="http://kafka.apache.org/documentation.html#quickstart">Kafka Guide</a>.</p>
<h1 id="usage">Usage</h1>
<p><strong>Example</strong></p>
<pre><code>const  kafka  =  require('node-kafka-wrapper');
function  sample() {
    kafka.producer.sendMessage(client_options, producer_options, ['sample_message'], 'sample_topic', () =&gt;  console.log('Done'));
    kafka.consumer.subscribe(client_options, consumer_options, ['sample_topic'], (message) =&gt; {
    // Do some operations
});
}
sample();
</code></pre>
<p><strong>Methods</strong></p>
<blockquote>
<p>sendMessage : behaves as a producer to send data to the broker<br>
subscribe : behaves as a consumer group to subscribe to messages</p>
</blockquote>
<h2 id="producer">Producer</h2>
<p>Connects to the broker as a HighLevelProducer to publish data to a topic. The message can either be a string or keyed message.</p>
<p>The syntax for the producer is as follows.</p>
<pre><code>const kafka = require('node-kafka-wrapper');
kafka.producer.sendMessage(client_options, producer_options, [string_message], topic_name, callback);
</code></pre>
<h2 id="consumer">Consumer</h2>
<p>Connects to the broker as a ConsumerGroup to subscribe to data from a topic.</p>
<p>The syntax for the consumer is as follows.</p>
<pre><code>const kafka = require('node-kafka-wrapper');
kafka.consumer.subscribe(client_options, consumer_options, ['topic1', 'topic2', 'topic3'], callback);
</code></pre>
<h1 id="parameters">Parameters</h1>
<p>All the client, producer/consumer options compatible with the <a href="https://www.npmjs.com/package/kafka-node">kafka-node</a> library is accepted.</p>
<h2 id="client_options">client_options</h2>
<p><strong>Example</strong></p>
<pre><code>{
  kafkaHost: 'www.kafka-domain.com',
  ssl: true,
  requestTimeout:  100000,
  sslOptions: {
    host:  'www.kafka-domain.com',
    ca: ['CA certificate'],
  },
}
</code></pre>
<ul>
<li>kafkaHost<code>: A string of kafka broker/host combination delimited by comma for example:</code><a href="http://kafka-1.us-east-1.myapp.com:9093">kafka-1.us-east-1.myapp.com:9093</a>,<a href="http://kafka-2.us-east-1.myapp.com:9093">kafka-2.us-east-1.myapp.com:9093</a>,<a href="http://kafka-3.us-east-1.myapp.com:9093">kafka-3.us-east-1.myapp.com:9093</a><code>default:</code>localhost:9092`.</li>
<li><code>connectTimeout</code>  : in ms it takes to wait for a successful connection before moving to the next host default:  <code>10000</code></li>
<li><code>requestTimeout</code>  : in ms for a kafka request to timeout default:  <code>30000</code></li>
<li><code>autoConnect</code>  : automatically connect when KafkaClient is instantiated otherwise you need to manually call  <code>connect</code>  default:  <code>true</code></li>
<li><code>connectRetryOptions</code>  : object hash that applies to the initial connection. see  <a href="https://www.npmjs.com/package/retry">retry</a>  module for these options.</li>
<li><code>idleConnection</code>  : allows the broker to disconnect an idle connection from a client (otherwise the clients continues to O after being disconnected). The value is elapsed time in ms without any data written to the TCP socket. default: 5 minutes</li>
<li><code>reconnectOnIdle</code>  : when the connection is closed due to client idling, client will attempt to auto-reconnect. default: true</li>
<li><code>maxAsyncRequests</code>  : maximum async operations at a time toward the kafka cluster. default: 10</li>
<li><code>sslOptions</code>:  <strong>Object</strong>, options to be passed to the tls broker sockets, ex.  <code>{ rejectUnauthorized: false }</code>  (Kafka 0.9+)</li>
<li><code>sasl</code>:  <strong>Object</strong>, SASL authentication configuration (only SASL/PLAIN is currently supported), ex.  <code>{ mechanism: 'plain', username: 'foo', password: 'bar' }</code>  (Kafka 0.10+)</li>
</ul>
<h2 id="producer_options">producer_options</h2>
<pre><code>{
    // Configuration for when to consider a message as acknowledged, default 1
    requireAcks: 1,
    // The amount of time in milliseconds to wait for all acks before considered, default 100ms
    ackTimeoutMs: 100,
    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    partitionerType: 2
}
</code></pre>
<h2 id="consumer_options">consumer_options</h2>
<pre><code>var options = {
  kafkaHost: 'broker:9092', // connect directly to kafka broker (instantiates a KafkaClient)
  batch: undefined, // put client batch settings if you need them
  ssl: true, // optional (defaults to false) or tls options hash
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  // An array of partition assignment protocols ordered by preference.
  // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
  protocol: ['roundrobin'],
  encoding: 'utf8', // default is utf8, use 'buffer' for binary data
  // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
  // equivalent to Java client's auto.offset.reset
  fromOffset: 'latest', // default
  commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
  // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
  outOfRangeOffset: 'earliest', // default
  // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
  // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
  onRebalance: (isAlreadyMember, callback) =&gt; { callback(); } // or null
};
</code></pre>
<h2 id="credits">Credits</h2>
<p>This is just a wrapper to simplify the implementation of <a href="https://www.npmjs.com/package/kafka-node">kafka-node</a>.</p>

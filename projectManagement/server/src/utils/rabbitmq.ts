import amqp from 'amqplib';

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (!rabbitmqUrl) {
      throw new Error('RabbitMQ URL is not defined in environment variables');
    }

    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');

    connection.on('close', () => {
      console.error('❌ RabbitMQ connection closed');
      channel = null;
    });

    connection.on('error', (err) => {
      console.error('❌ RabbitMQ connection error:', err);
      channel = null;
    });

  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('❌ RabbitMQ channel is not initialized');
  }
  return channel;
};

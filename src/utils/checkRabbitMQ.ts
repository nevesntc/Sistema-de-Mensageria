import * as amqp from 'amqplib';
import { environment } from '../config/environment';

export async function checkRabbitMQConnection(): Promise<boolean> {
  try {
    const connection = await amqp.connect(environment.rabbitmq.url, {
      timeout: 5000
    });
    await connection.close();
    return true;
  } catch (error) {
    console.error('RabbitMQ connection check failed:', error);
    return false;
  }
}

export async function waitForRabbitMQ(maxAttempts = 5, delay = 5000): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Checking RabbitMQ connection (attempt ${attempt}/${maxAttempts})...`);
    
    if (await checkRabbitMQConnection()) {
      console.log('RabbitMQ is available!');
      return;
    }

    if (attempt < maxAttempts) {
      console.log(`RabbitMQ not available. Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Could not connect to RabbitMQ after multiple attempts');
} 
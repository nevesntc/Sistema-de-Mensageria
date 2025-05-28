import * as amqp from 'amqplib';
import { Message } from '../../domain/entities/Message';
import { IMessageQueue } from '../../domain/services/IMessageQueue';

export class RabbitMQMessageQueue implements IMessageQueue {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private readonly maxRetries = 5;
  private retryCount = 0;

  constructor(private readonly url: string) {}

  private async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    try {
      this.connection = await amqp.connect(this.url, {
        heartbeat: 60,
        timeout: 10000
      });

      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.handleConnectionError();
      });

      this.channel = await this.connection.createChannel();
      this.retryCount = 0; // Reset retry count on successful connection
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.handleConnectionError();
      throw error;
    }
  }

  private handleConnectionError(): void {
    this.connection = null;
    this.channel = null;

    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000); // Exponential backoff, max 30s
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      this.reconnectTimeout = setTimeout(() => {
        this.ensureConnection().catch(console.error);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      process.exit(1);
    }
  }

  async publish(queue: string, message: Message): Promise<void> {
    await this.ensureConnection();
    if (!this.channel) throw new Error('Channel not initialized');

    try {
      await this.channel.assertQueue(queue, { 
        durable: true,
        arguments: {
          'x-message-ttl': 86400000 // 24 hours in milliseconds
        }
      });
      
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true
      });
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  async subscribe(queue: string, callback: (message: Message) => Promise<void>): Promise<void> {
    await this.ensureConnection();
    if (!this.channel) throw new Error('Channel not initialized');

    try {
      await this.channel.assertQueue(queue, { 
        durable: true,
        arguments: {
          'x-message-ttl': 86400000 // 24 hours in milliseconds
        }
      });
      
      this.channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const message = JSON.parse(msg.content.toString()) as Message;
            await callback(message);
            this.channel?.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            // Reject message and requeue
            this.channel?.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error('Error subscribing to queue:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
} 
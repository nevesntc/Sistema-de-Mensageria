import { Message } from '../../domain/entities/Message';
import { IMessageQueue } from '../../domain/services/IMessageQueue';
import { ReceiveMessageUseCase } from '../../application/useCases/ReceiveMessageUseCase';

export class MessageConsumer {
  constructor(
    private messageQueue: IMessageQueue,
    private receiveMessageUseCase: ReceiveMessageUseCase
  ) {}

  async start(): Promise<void> {
    await this.messageQueue.subscribe('messages', async (message: Message) => {
      try {
        await this.receiveMessageUseCase.execute(message);
      } catch (error) {
        console.error('Error processing message:', error);
        throw error; // Re-throw to trigger nack in RabbitMQ
      }
    });
  }
} 
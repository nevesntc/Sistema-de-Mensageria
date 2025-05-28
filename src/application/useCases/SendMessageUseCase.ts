import { Message, MessageStatus } from '../../domain/entities/Message';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { IMessageQueue } from '../../domain/services/IMessageQueue';

export class SendMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private messageQueue: IMessageQueue
  ) {}

  async execute(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<void> {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: MessageStatus.PENDING
    };

    await this.messageRepository.save(newMessage);
    await this.messageQueue.publish('messages', newMessage);
  }
} 